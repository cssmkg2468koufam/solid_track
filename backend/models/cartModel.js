const pool = require('../config/db');

const addToCartModel = async (customer_id, productId, quantity,total) => {
    
    // const [product] = await pool.query("SELECT price_of_one_product FROM products WHERE product_id = ?", [productId]);
    // if (!product) throw new Error('Product not found');
    
    const query = `
        INSERT INTO carts (customer_id, product_id, quantity, price) 
        VALUES (?, ?, ?, ?) 
    `;
    return pool.query(query, [customer_id, productId, quantity, total]);
}

const checkCartItemExists = async (customer_id, product_id,quantity) => {
    const [rows] = await pool.query(
        'SELECT * FROM carts WHERE customer_id = ? AND product_id = ? AND quantity = ?',
        [customer_id, product_id,quantity]
    );
    return rows.length > 0 ? rows[0] : null;
};

const getCartItemsModel = async (customer_id) => {
    const query = `SELECT c.id, c.customer_id, c.product_id, c.quantity, c.price, p.product_name, p.price_of_one_product, p.image_url
                   FROM carts c
                   JOIN products p ON c.product_id = p.product_id
                   WHERE c.customer_id = ?`;
                   const [rows] = await pool.query(query, [customer_id]); // Destructure only `rows`
                   return rows; // Return only the data
}

const deleteCartItemModel = async ( cartItemId) => {
    const query = "DELETE FROM carts WHERE id = ?";
    return pool.query(query, [ cartItemId]);
}

const updateCartItemModel = async (userId, cartItemId, quantity) => {
    const query = "UPDATE carts SET quantity = ? WHERE user_id = ? AND cart_id = ?";
    return pool.query(query, [quantity, userId, cartItemId]);
};

module.exports = { addToCartModel, getCartItemsModel, deleteCartItemModel, updateCartItemModel, checkCartItemExists };