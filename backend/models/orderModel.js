const pool = require("../config/db");

const getOrders = async () => {      
    const query = "SELECT * FROM orders";      
    const [rows] = await pool.query(query);      
    return rows;    
}
const createOrder = async (customer_id, delivery_date, location) => {
  const [result] = await pool.execute(
    'INSERT INTO orders (customer_id, delivery_date, location) VALUES (?, ?, ?)',
    [customer_id, delivery_date, location]
  );
  return result.insertId; // This is your order_id
};

const addOrderItem = async (order_id, product_id, quantity, total) => {
  await pool.execute(
    'INSERT INTO order_items (order_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)',
    [order_id, product_id, quantity, total]
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

module.exports = { getOrders, deleteOrderModel , createOrder, addOrderItem, getCustomerOrderModel };