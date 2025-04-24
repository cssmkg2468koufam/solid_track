const pool = require("../config/db");

const createCustomer = async (fullName, email, phone, password) => {
    const query = 
         `INSERT INTO customer (full_name, email, phone, password,role) VALUES (?, ?, ?, ?,'customer')`;
    return pool.query(query, [fullName, email, phone, password]);
}

const getCustomerByEmail = async (email) => {
    const query = "SELECT * FROM customer WHERE email = ?";
    const [rows] = await pool.query(query, [email]);
    return rows.length > 0 ? rows[0] : null;
}

const getCustomerEmail = async (customerId) => {
    const query = "SELECT * FROM customer WHERE customer_id = ?";
    const [rows] = await pool.query(query, [customerId]);
    return rows.length > 0 ? rows[0] : null;
}

const createNewAdmin = async (email,password,role) => {
    const query = 
         `INSERT INTO admin (email,password,role) VALUES (?, ?, 'admin')`;
    return pool.query(query, [email,password,role]);
}

const getAdminByEmail = async (email) => {
    const query = "SELECT * FROM admin WHERE email = ?";
    const [rows] = await pool.query(query, [email]);
    return rows.length > 0 ? rows[0] : null;
}

module.exports = { createCustomer, getCustomerByEmail, getCustomerEmail, createNewAdmin, getAdminByEmail };