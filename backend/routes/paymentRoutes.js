const express = require("express");
const pool = require('../config/db');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { get } = require("http");
const bodyParser = require("body-parser");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const db = require("../config/db");

const { getAllPayments, updateStatus, getPaymentDetailsByOrder, handleStripeWebhook } = require('../controllers/paymentController');

router.post("/webhook", bodyParser.raw({ type: "application/json" }), handleStripeWebhook);

router.get('/get', getAllPayments);
router.put('/updateStatus/:paymentId', updateStatus);
router.get('/payment-details/:order_id', getPaymentDetailsByOrder);

// New endpoint for customer payments
router.get('/customer-payments/:customer_id', async (req, res) => {
  try {
    const { customer_id } = req.params;
    
    const payments = await pool.query(`
      SELECT 
        p.payment_id,
        p.order_id,
        p.amount,
        p.remain_balance,
        p.payment_method,
        p.status,
        p.created_at as payment_date,
        o.total_amount as order_total,
        o.status as order_status
      FROM payment p
      JOIN orders o ON p.order_id = o.order_id
      WHERE p.customer_id = ?
      ORDER BY p.created_at DESC
    `, [customer_id]);

    res.json({ 
      success: true,
      payments: payments[0] 
    });
  } catch (err) {
    console.error('Error fetching customer payments:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

router.get('/get-pending', async (req, res) => {
  try {
    const payments = await pool.query(`
      SELECT p.*, c.full_name AS customer_name
      FROM payment p
      JOIN customer c ON p.customer_id = c.customer_id
      Order by p.created_at Asc
    `);
    res.json(payments[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Configure upload directory
const uploadDir = path.join(__dirname, '../../uploads/payments');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .jpeg, .jpg, .png, and .pdf files are allowed'));
  }
});

router.post('/upload-receipt', upload.single('receipt'), async (req, res) => {
  try {
    const { order_id, customer_id, amount, payment_method } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No file uploaded' 
      });
    }

    const img_url = `/uploads/payments/${req.file.filename}`;

    // Start transaction
    await pool.query('START TRANSACTION');

    try {
      // Insert payment record
      const [paymentResult] = await pool.query(`
        INSERT INTO payment 
        (order_id, customer_id, amount, payment_method, img_url, status, created_at)
        VALUES (?, ?, ?, ?, ?, 'pending', NOW())
      `, [order_id, customer_id, amount, payment_method, img_url]);

      // Update order status
      await pool.query(
        'UPDATE orders SET status = ? WHERE order_id = ?',
        ['pending_pay', order_id]
      );

      // Commit transaction
      await pool.query('COMMIT');

      res.status(201).json({ 
        success: true,
        message: 'Receipt uploaded and payment recorded successfully',
        data: {
          payment_id: paymentResult.insertId,
          order_id,
          amount,
          payment_method,
          img_url,
          status: 'pending'
        }
      });
      
    } catch (dbError) {
      // Rollback transaction on error
      await pool.query('ROLLBACK');
      
      // Delete the uploaded file if DB operation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

      console.error('Database error:', dbError);
      res.status(500).json({ 
        success: false,
        error: 'Database operation failed',
        details: dbError.message 
      });
    }
    
  } catch (error) {
    console.error('Error processing receipt upload:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      details: error.message 
    });
  }
});

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { order_id, amount } = req.body;

    if (!order_id || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Order ID and amount are required'
      });
    }

    const status = "paid";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'LKR',
          product_data: {
            name: `Order #${order_id}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success?order_id=${order_id}&status=paid&amount=${amount}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: {
        order_id,
        paymentType: 'full',
        amount,
        status,
      }
    });

    res.json({ 
      success: true,
      sessionId: session.id 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      error: 'Payment processing failed',
      details: error.message
    });
  }
});

router.post("/create-advance-checkout-session", async (req, res) => {
  const { order_id, amount, remain_balance } = req.body;
  console.log("order_id", order_id);
  console.log("amount", amount);
  console.log("remain_balance", remain_balance);

  try { 
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'lkr',
          product_data: {
            name: `Order #${order_id} Advance Payment`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success?order_id=${order_id}&status=advanced-paid&amount=${amount}&remain_balance=${remain_balance}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: {
        order_id,
        paymentType: 'advance',
        remain_balance,
      }
    });

    res.json({ 
      success: true,
      sessionId: session.id 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      error: 'Payment processing failed',
      details: error.message
    });
  }
});

router.post("/update-order-status", async (req, res) => {
  const { order_id, status, remain_balance } = req.body;

  try {
    let query, params;
    if (status === "advanced-paid") {
      query = "UPDATE orders SET status = ?, remain_balance = ?, created_at = NOW() WHERE order_id = ?";
      params = [status, remain_balance, order_id];
    } else if (status === "paid") {
      query = "UPDATE orders SET status = ?, remain_balance = '0', created_at = NOW() WHERE order_id = ?";
      params = [status, order_id];
    } else {
      return res.status(400).json({ error: "Invalid status" });
    }

    await db.query(query, params);
    res.json({ message: "Order status updated successfully" });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

module.exports = router;