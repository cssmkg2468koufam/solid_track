const {
  getOrders, 
  deleteOrderModel, 
  createOrder,
  addOrderItem, 
  getCustomerOrderModel,
  updateOrderStatusModel,
  getOrderDetailsForInvoiceModel,
  getOrderItemsByOrderId,
  getRawMaterialsForProduct,
  reduceMaterialQuantity,
  getMaterialCurrentQuantity,
  getRawMaterialsForProduct1,
  getOrderItemsByOrderId1
} = require('../models/orderModel');

const pool = require('../config/db');

const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

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
  const { customer_id, delivery_date,  items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "No items provided" });
  }

  try {
    const order_id = await createOrder(customer_id, delivery_date);

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
   const productsWithFullUrls = orders.map(product => ({
      ...product,
      image_url: product.image_url ? `${req.protocol}://${req.get('host')}${product.image_url}` : null
    }));
    res.status(200).json(productsWithFullUrls);
  } catch (err) {
    console.error('Error getting customer orders:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const cancelOrder = async (req, res) => {
  const { orderid } = req.params;
  console.log('Cancelling order with ID:', orderid);
  try {
    await updateOrderStatusModel(orderid, 'cancelled');
    res.status(200).json({ message: 'Order cancelled successfully' });
  } catch (err) {
    console.error('Error cancelling order:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const updateOrderStatus = async (req, res) => {
  const { order_id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'approved', 'shipped', 'delivered', 'cancelled', 'arranged','paid'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }
  try {
    await updateOrderStatusModel(order_id, status);

    // 👇 Only proceed if status is 'arranged'
    if (status === 'arranged') {
      const orderItems = await getOrderItemsByOrderId(order_id);

      for (const item of orderItems) {
        const rawMaterials = await getRawMaterialsForProduct(item.product_id);

        for (const raw of rawMaterials) {
          const totalRequiredQty = raw.quantity_required * item.quantity;
          await reduceMaterialQuantity(raw.material_id, totalRequiredQty);
        }
      }
    }

    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getOrderDetailsForInvoice = async (req, res) => {
  const { order_id } = req.params;
  try {
    const order = await getOrderDetailsForInvoiceModel(order_id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Calculate total if not already done in the model
    order.total = order.items.reduce(
      (sum, item) => sum + (item.quantity * item.price_of_one_product),
      0
    );

    res.status(200).json(order);
  } catch (err) {
    console.error('Error getting order details for invoice:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}; 

const checkOrderInventory = async (req, res) => {
  const { order_id } = req.params;

  try {
    const orderItems = await getOrderItemsByOrderId1(order_id);
    let hasEnoughMaterials = true;
    const insufficientMaterials = [];

    for (const item of orderItems) {
      const rawMaterials = await getRawMaterialsForProduct1(item.product_id);

      for (const raw of rawMaterials) {
        const totalRequiredQty = raw.quantity_required * item.quantity;
        const currentInventory = await getMaterialCurrentQuantity(raw.material_id);
        
        if (currentInventory < totalRequiredQty) {
          hasEnoughMaterials = false;
          insufficientMaterials.push({
            material_id: raw.material_id,
            material_name: raw.material_name,
            required: totalRequiredQty,
            available: currentInventory
          });
        }
      }
    }

    if (!hasEnoughMaterials) {
      return res.status(200).json({ 
        hasEnoughMaterials: false,
        insufficientMaterials 
      });
    }

    res.status(200).json({ hasEnoughMaterials: true });
  } catch (err) {
    console.error('Error checking inventory:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { 
  getAllOrders, 
  deleteOrder, 
  addFullOrder, 
  getCustomerOrder,
  updateOrderStatus ,
  getOrderDetailsForInvoice,
  cancelOrder,
  checkOrderInventory,
 
};