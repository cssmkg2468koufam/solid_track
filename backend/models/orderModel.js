const pool = require("../config/db");

const getOrders = async () => {      
  const query = `
    SELECT 
      o.order_id,
      o.customer_id,
      c.full_name AS customer_name,
      o.status,
      o.delivery_date,
      o.location,
      o.created_at,
      SUM(oi.total_price) AS total_amount
    FROM orders o
    LEFT JOIN customer c ON o.customer_id = c.customer_id
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    GROUP BY o.order_id
    ORDER BY o.created_at DESC
  `;
  const [rows] = await pool.query(query);      
  return rows;    
}

const createOrder = async (customer_id, delivery_date, location) => {
  const [result] = await pool.execute(
    'INSERT INTO orders (customer_id, delivery_date, location) VALUES (?, ?, ?)',
    [customer_id, delivery_date, location]
  );
  return result.insertId;
};

const addOrderItem = async (order_id, product_id, quantity, total) => {
  await pool.execute(
    'INSERT INTO order_items (order_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)',
    [order_id, product_id, quantity, total]
  );
};


const getOrderItemsByOrderId = async (order_id) => {
  const [rows] = await pool.query(
    'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
    [order_id]
  );
  return rows;
};

const getRawMaterialsForProduct = async (product_id) => {
  const [rows] = await pool.query(
    'SELECT material_id, quantity_required FROM product_raw_materials WHERE product_id = ?',
    [product_id]
  );
  return rows;
};

const reduceMaterialQuantity = async (material_id, qty) => {
  await pool.query(
    'UPDATE materials SET quantity = quantity - ? WHERE material_id = ?',
    [qty, material_id]
  );
};


const deleteOrderModel = async (order_id) => {
  const query = "DELETE FROM orders WHERE order_id = ?";
  return pool.query(query, [order_id]);
}

const getCustomerOrderModel = async (customer_id) => {
  const query = `
    SELECT 
      o.order_id,
      o.customer_id,
      o.status AS order_status,
      o.delivery_date,
      o.location,
      o.created_at,
      oi.product_id,
      oi.quantity,
      oi.total_price,
      p.product_name,
      p.price_of_one_product,
      p.image_url
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE o.customer_id = ?
    ORDER BY o.created_at DESC
  `;
  const [rows] = await pool.query(query, [customer_id]);
  return rows;
};

const updateOrderStatusModel = async (order_id, status) => {
  const query = "UPDATE orders SET status = ? WHERE order_id = ?";
  return pool.query(query, [status, order_id]);
};

const getOrderDetailsForInvoiceModel = async (order_id) => {
  // First get order header information
  const [orderHeader] = await pool.query(`
    SELECT 
      o.order_id,
      o.customer_id,
      c.full_name AS customer_name,
      o.status,
      o.delivery_date,
      o.location,
      o.created_at
    FROM orders o
    JOIN customer c ON o.customer_id = c.customer_id
    WHERE o.order_id = ?
  `, [order_id]);

  if (orderHeader.length === 0) {
    return null;
  }

  // Then get order items
  const [orderItems] = await pool.query(`
    SELECT 
      oi.product_id,
      p.product_name,
      oi.quantity,
      p.price_of_one_product,
      oi.total_price,
      p.image_url
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    WHERE oi.order_id = ?
  `, [order_id]);

  // Combine into a single object
  const order = {
    ...orderHeader[0],
    items: orderItems
  };

  return order;
};

module.exports = { 
  getOrders, 
  deleteOrderModel, 
  createOrder, 
  addOrderItem, 
  getCustomerOrderModel,
  updateOrderStatusModel ,
  getOrderDetailsForInvoiceModel,
  getOrderItemsByOrderId,
  getRawMaterialsForProduct,
  reduceMaterialQuantity
};