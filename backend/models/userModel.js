const pool = require("../config/db");

const createCustomer = async (fullName, email, phone, password_hash) => {
    const query = 
         `INSERT INTO customer (full_name, email, phone, password_hash) VALUES (?, ?, ?, ?)`;
         return pool.query(query, [fullName, email, phone, password_hash]);
}

const getCustomerByEmail = async (email) => {
    const query = "SELECT * FROM customer WHERE email = ?";
    const [rows] = await pool.query(query, [email]);
    return rows.length > 0 ? rows[0] : null;
};

module.exports = {  createCustomer, getCustomerByEmail };
