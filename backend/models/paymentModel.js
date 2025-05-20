const db = require('../config/db');

const getPayments = () => {
  const query = `
    SELECT p.*, c.full_name AS customer_name
    FROM payment p
    JOIN customer c ON p.customer_id = c.customer_id
  `;
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const updateStatusPayment = (paymentId, status) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE payment SET status = ? WHERE payment_id = ?",
      [status, paymentId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

const getPaymentsByStatus = (status) => {
  const query = `
    SELECT p.*, c.full_name AS customer_name
    FROM payment p
    JOIN customer c ON p.customer_id = c.customer_id
    WHERE p.status = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(query, [status], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const getPaymentDetails = (orderId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        p.payment_id,
        p.amount,
        p.payment_method,
        p.status AS payment_status,
        p.created_at AS payment_date,
        o.order_id,
        o.status AS order_status,
        o.remain_balance,
        oi.total_price AS order_total,
        c.full_name AS customer_name
      FROM payment p
      JOIN orders o ON p.order_id = o.order_id
      JOIN customer c ON p.customer_id = c.customer_id
      JOIN order_items oi ON o.order_id = oi.order_id
      WHERE p.order_id = ?
      ORDER BY p.created_at DESC
      LIMIT 1
    `;
    
    db.query(query, [orderId], (err, results) => {
      if (err) return reject(err);
      
      if (results.length === 0) {
        // Fallback to just order data
        const orderQuery = `SELECT * FROM orders WHERE order_id = ?`;
        db.query(orderQuery, [orderId], (orderErr, orderResults) => {
          if (orderErr) return reject(orderErr);
          if (orderResults.length === 0) return resolve(null);
          
          resolve({
            amount: orderResults[0].total - (orderResults[0].remain_balance || 0),
            remain_balance: orderResults[0].remain_balance,
            payment_status: orderResults[0].status,
            order_status: orderResults[0].status
          });
        });
      } else {
        resolve(results[0]);
      }
    });
  });
};

module.exports = {
  getPayments,
  updateStatusPayment,
  getPaymentsByStatus,
  getPaymentDetails


}