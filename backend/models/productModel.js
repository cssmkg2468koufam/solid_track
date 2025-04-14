const db = require("../config/db");

const getAll = async () => {
  const query = 'SELECT * FROM products ';
  try {
    const [rows] = await db.query(query);
    return rows;
  } catch (err) {
    throw err;
  }
};


  const createProduct = async (productName, quantity, price, status) => {
    const query = 'INSERT INTO products (product_name, quantity, price_of_one_product, status) VALUES (?, ?, ?, ?)';
    try {
      const [result] = await db.query(query, [productName, quantity, price, status || 'In Stock']);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  };
  

  // static async search(searchTerm) {
  //   const query = `
  //     SELECT * FROM products 
  //     WHERE product_name LIKE ? OR id LIKE ?
  //     ORDER BY created_at DESC
  //   `;
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       query,
  //       [`%${searchTerm}%`, `%${searchTerm}%`],
  //       (err, results) => {
  //         if (err) reject(err);
  //         resolve(results);
  //       }
  //     );
  //   });
  // }

module.exports = {getAll, createProduct};