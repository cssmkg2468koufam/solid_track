const pool = require('../config/db');

const getCustomers = async () => {      
    const query = "SELECT customer_id, full_name, email, phone FROM customer";      
    const [rows] = await pool.query(query);      
    return rows;    
}

const deleteCustomerModel = async (customer_id) => {
    const query = "DELETE FROM customer WHERE customer_id = ?";
    return pool.query(query, [customer_id]);
}

module.exports = {getCustomers};