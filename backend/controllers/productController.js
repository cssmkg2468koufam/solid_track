const { getAll, createProduct } = require('../models/productModel');

const getAllProducts = async (req, res) => { 
  try {
      const products = await getAll();
      res.status(200).json(products);
  } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ message: 'Error fetching products' });
  }
}


const createNewProduct = async (req, res) => {
  const { productName, quantity, price, status } = req.body;

  if (!productName || !quantity || !price || !status) {
      return res.status(400).json({ error: 'Please fill all fields' });
  }

  try {
      await createProduct(productName, quantity, price, status);
      res.status(201).json({ message: 'Product created successfully' });
  } catch (err) {
      console.error('Error creating product:', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}


// exports.searchProducts = async (req, res) => {
//   try {
//     const { term } = req.query;
//     const products = await Product.search(term);
//     res.json(products);
//   } catch (error) {
//     console.error('Error searching products:', error);
//     res.status(500).json({ message: 'Error searching products' });
//   }
// };

module.exports = {getAllProducts, createNewProduct};