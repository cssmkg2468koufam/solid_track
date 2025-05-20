const { getCustomers,deleteCustomerModel, getCustomerCountModel } = require('../models/customerModel');

const getAllCustomers = async (req, res) => { 
    try {
        const customer = await getCustomers();
        res.status(200).json(customer);
        console.log(customer);
    } catch (err) {
        console.error('Error getting materials:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteCustomer = async (req, res) => {
    const customerId = req.params.id;
    try {
        const result = await deleteCustomerModel(customerId);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Customer deleted successfully' });
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (err) {
        console.error('Error deleting customer:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getCustomerCount = async (req, res) => {
  try {
    const count = await getCustomerCountModel();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { getAllCustomers, deleteCustomer, getCustomerCount };