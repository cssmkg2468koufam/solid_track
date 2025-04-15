const pool = require("../config/db");

const createCustomer = async (fullName, email, phone, password) => {
    const query = 
         `INSERT INTO customer (full_name, email, phone, password) VALUES (?, ?, ?, ?)`;
    return pool.query(query, [fullName, email, phone, password]);
}

const getCustomerByEmail = async (email) => {
    const query = "SELECT * FROM customer WHERE email = ?";
    const [rows] = await pool.query(query, [email]);
    return rows.length > 0 ? rows[0] : null;
};

module.exports = { createCustomer, getCustomerByEmail };