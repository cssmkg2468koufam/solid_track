const pool = require('../config/db');

const getProductCount= async () => {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM products');
    return rows[0].count;
  }

const getMaterialCountModel = async () => {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM materials');
    return rows[0].count;
  }

const getCustomerCountModel = async () => {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM customer');
    return rows[0].count;
  }

const getOrderCountModel = async () => {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM orders');
    return rows[0].count;
  }

  const getMaterialCurrentQuantity = async (material_id) => {
  const query = "SELECT current_quantity FROM raw_materials WHERE material_id = ?";
  const [rows] = await pool.query(query, [material_id]);
  return rows[0]?.current_quantity || 0;
};

const getRawMaterialsForProduct = async (product_id) => {
  const query = `
    SELECT rm.material_id, rm.material_name, prm.quantity_required 
    FROM product_raw_materials prm
    JOIN raw_materials rm ON prm.material_id = rm.material_id
    WHERE prm.product_id = ?
  `;
  const [rows] = await pool.query(query, [product_id]);
  return rows;
};

const getOrderItemsByOrderId = async (order_id) => {
  const query = "SELECT * FROM order_items WHERE order_id = ?";
  const [rows] = await pool.query(query, [order_id]);
  return rows;
};

const getOrdersByMonth = async () => {
  const query = `
    SELECT 
      MONTH(created_at) as month, 
      COUNT(*) as count 
    FROM orders 
    WHERE YEAR(created_at) = YEAR(CURRENT_DATE())
    GROUP BY MONTH(created_at)
    ORDER BY month
  `;
  const [rows] = await pool.query(query);
  
  // Initialize array with 12 months (0 values)
  const monthlyOrders = Array(12).fill(0);
  rows.forEach(row => {
    monthlyOrders[row.month - 1] = row.count;
  });
  
  return monthlyOrders;
};

const getProductsByCategory = async () => {
  const query = `
    SELECT 
      category, 
      COUNT(*) as count 
    FROM products 
    GROUP BY category
  `;
  const [rows] = await pool.query(query);
  return rows;
};

const getCustomerGrowth = async () => {
  const query = `
    SELECT 
      QUARTER(created_at) as quarter, 
      COUNT(*) as count 
    FROM customer 
    WHERE YEAR(created_at) = YEAR(CURRENT_DATE())
    GROUP BY QUARTER(created_at)
    ORDER BY quarter
  `;
  const [rows] = await pool.query(query);
  
  // Initialize array with 4 quarters (0 values)
  const quarterlyCustomers = Array(4).fill(0);
  rows.forEach(row => {
    quarterlyCustomers[row.quarter - 1] = row.count;
  });
  
  return quarterlyCustomers;
};

module.exports = {getProductCount,getMaterialCountModel,getCustomerCountModel,getOrderCountModel,getRawMaterialsForProduct,getOrderItemsByOrderId,getMaterialCurrentQuantity, getOrdersByMonth, getProductsByCategory, getCustomerGrowth};