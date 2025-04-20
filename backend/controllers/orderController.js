const {getOrders, deleteOrderModel } = require('../models/orderModel');

const getAllOrders = async (req, res) => {
    try {
        const orders = await getOrders();
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error getting orders:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteOrderModel(id);
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAllOrders, deleteOrder };