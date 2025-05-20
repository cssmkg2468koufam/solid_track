const pool = require("../config/db");

const getAll = async () => {
  const query = 'SELECT * FROM products ORDER BY product_id ASC';
  try {
    const [rows] = await pool.query(query);
    return rows;
  } catch (err) {
    throw err;
  }
}

const createProduct = async (productName, description, quantity, price, status, category, imageUrl) => {
  const query = `
    INSERT INTO products 
    (product_name, description, quantity, price_of_one_product, status, category, image_url) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  try {
    const [result] = await pool.query(query, [
      productName, 
      description, 
      quantity, 
      price, 
      status || 'In Stock', 
      category || 'Flower Pots',
      imageUrl || ''
    ]);
    return result.insertId;
  } catch (error) {
    throw error;
  }
}

const addMaterialToProduct = async (product_id, material_id, quantity_required) => {
  const query = `
    INSERT INTO product_raw_materials 
    (product_id, material_id, quantity_required) 
    VALUES (?, ?, ?)
  `;
  try {
    const [result] = await pool.query(query, [
      product_id,
      material_id,
      quantity_required
    ]);
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

const getProductsByCategory = async (category) => {
  const query = `
    SELECT * FROM products 
    WHERE category = ?
    ORDER BY product_id DESC
  `;
  try {
    const [rows] = await pool.query(query, [category]);
    return rows;
  } catch (err) {
    throw err;
  }
}

const getProductById = async (id) => {
  const query = 'SELECT * FROM products WHERE product_id = ?';
  try {
    const [rows] = await pool.query(query, [id]);
    return rows[0]; // Return the first (and should be only) matching product
  } catch (err) {
    throw err;
  }
}

const editProduct = async (id, productName, description, quantity, price, status, category, imageUrl) => {
  const query = `
    UPDATE products 
    SET 
      product_name = ?, 
      description = ?, 
      quantity = ?, 
      price_of_one_product = ?, 
      status = ?, 
      category = ?,
      image_url = ?
    WHERE product_id = ?
  `;
  try {
    const [result] = await pool.query(query, [
      productName, 
      description, 
      quantity, 
      price, 
      status, 
      category,
      imageUrl,
      id
    ]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (id) => {
  const query = 'DELETE FROM products WHERE product_id = ?';
  try {
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
}

const getAllProductsByCategory = async (category) => {
  const query = `
    SELECT * FROM products 
    WHERE category = ?
    ORDER BY product_id DESC
  `;
  try {
    const [rows] = await pool.query(query, [category]);
    return rows;
  } catch (err) {
    throw err;
  }
};

const getAllProductById = async (id) => {
  const query = 'SELECT * FROM products WHERE product_id = ?';
  try {
    const [rows] = await pool.query(query, [id]);
    return rows[0]; // Return the first (and should be only) matching product
  } catch (err) {
    throw err;
  }
};


module.exports = {getAll, createProduct, getProductsByCategory, getProductById, editProduct, deleteProduct, getAllProductById, getAllProductsByCategory, addMaterialToProduct};