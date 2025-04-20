const pool = require("../config/db");

const getOrders = async () => {      
    const query = "SELECT * FROM orders";      
    const [rows] = await pool.query(query);      
    return rows;    
}

const deleteOrderModel = async (order_id) => {
    const query = "DELETE FROM orders WHERE order_id = ?";
    return pool.query(query, [order_id]);
}

module.exports = { getOrders, deleteOrderModel };