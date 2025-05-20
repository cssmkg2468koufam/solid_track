const {
getPayments,
updateStatusPayment,
getPaymentsByStatus,
getPaymentDetails,
} = require('../models/paymentModel');

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const getAllPayments = async (req, res) => {
  try {
    const payments = await getPayments();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
};

const updateStatus = async (req, res) => {
  const paymentId = req.params.paymentId;
  const { status } = req.body;

  console.log("Updating payment status:", paymentId, status);

  try {
    await updateStatusPayment(paymentId, status);
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPendingPayments = async (req, res) => {
  try {
    const payments = await getPaymentsByStatus('pending');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPaymentDetailsByOrder = async (req, res) => {
  const { order_id } = req.params;
  
  try {
    const paymentDetails = await getPaymentDetails(order_id);
    
    if (!paymentDetails) {
      return res.status(404).json({ 
        error: 'Payment details not found for this order' 
      });
    }

    res.status(200).json(paymentDetails);
  } catch (err) {
    console.error('Error fetching payment details:', err);
    res.status(500).json({ 
      error: 'Failed to fetch payment details',
      details: err.message 
    });
  }
};

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;
    const paymentType = session.metadata?.paymentType;

    if (!bookingId || !paymentType) {
      return res.status(400).send("Missing metadata");
    }

    try {
      if (paymentType === "full") {
        await db.query(
          "UPDATE orders SET status = ?, remaining_balance = ? WHERE order_id = ?",
          ["paid", "0.00", order_id]
        );
      } else if (paymentType === "advance") {
        const remain_balance = session.metadata?.remain_balance || "0.00";
        await db.query(
          "UPDATE orders SET status = ?, remaining_balance = ? WHERE order_id = ?",
          ["advanced-paid", remain_balance, order_id]
        );
      }

      return res.status(200).json({ received: true });
    } catch (dbError) {
      console.error("Database update failed:", dbError);
      return res.status(500).send("Database error");
    }
  }

  res.status(200).json({ received: true });
};

module.exports = {
  getAllPayments,
  updateStatus,
    getPendingPayments,
  handleStripeWebhook,
  getPaymentDetailsByOrder,
};
