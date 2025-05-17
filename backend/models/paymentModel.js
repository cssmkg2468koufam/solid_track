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

module.exports = {
  getPayments,
  updateStatusPayment,
  getPaymentsByStatus,


}