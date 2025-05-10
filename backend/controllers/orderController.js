const {getOrders, deleteOrderModel, createOrder,addOrderItem, getCustomerOrderModel} = require('../models/orderModel');

const getAllOrders = async (req, res) => {
    try {
        const orders = await getOrders();
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error getting orders:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const addFullOrder = async (req, res) => {
  const { customer_id, delivery_date, location, items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "No items provided" });
  }

  try {
    // Create order and get order_id
    const order_id = await createOrder(customer_id, delivery_date, location);

    // Insert each item into order_items table
    for (const item of items) {
      await addOrderItem(order_id, item.product_id, item.quantity, item.total);
    }

    res.status(201).json({ message: 'Order placed successfully', order_id });
  } catch (error) {
    console.error("Order placement failed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteOrderModel(id);
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getCustomerOrder = async (req, res) => {
    const { customer_id } = req.params;
    try {
        const orders = await getCustomerOrderModel(customer_id);
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error getting customer orders:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAllOrders, deleteOrder , addFullOrder, getCustomerOrder };