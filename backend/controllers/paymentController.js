const {
getPayments,
updateStatusPayment,
getPaymentsByStatus,
} = require('../models/paymentModel');

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

module.exports = {
  getAllPayments,
  updateStatus,
    getPendingPayments,
};
