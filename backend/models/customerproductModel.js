const db = require("../config/db");

const getCustomerProducts = async () => {
    const query = `
        SELECT cp.id, cp.customer_id, cp.product_id, cp.quantity, cp.status, p.product_name, p.price_of_one_product
        FROM customer_products AS cp
        JOIN products AS p ON cp.product_id = p.id
    `;
    try {
        const [rows] = await db.query(query);
        return rows;
    } catch (err) {
        throw err;
    }
    }

module.exports = { getCustomerProducts };