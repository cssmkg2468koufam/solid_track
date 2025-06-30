const {
getPayments,
updateStatusPayment,
getPaymentsByStatus,
getPaymentDetails,
} = require('../models/paymentModel');

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

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



module.exports = {
  getAllPayments,
  updateStatus,
    getPendingPayments,

  getPaymentDetailsByOrder,
};
