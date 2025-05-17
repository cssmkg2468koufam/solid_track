const { getAll, createProduct, getAllProductsByCategory , getAllProductById , editProduct, deleteProduct , addMaterialToProduct} = require('../models/productModel');

const getAllProducts = async (req, res) => { 
  try {
    const products = await getAll();
    res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

const createNewProduct = async (req, res) => {
  const { productName, description, quantity, price, status, category, imageUrl } = req.body;
  console.log(req.body);

  if (!productName || !description || quantity === undefined || price === undefined) {
    return res.status(400).json({ error: 'Please fill all required fields' });
  }

  try {
    const insertId = await createProduct(productName, description, quantity, price, status, category, imageUrl);
    res.status(201).json({ 
      message: 'Product created successfully',
      insertId 
    });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addProductMaterial = async (req, res) => {
  const { product_id, material_id, quantity_required, unit } = req.body;
  console.log(req.body);

  if (!product_id || !material_id || quantity_required === undefined || !unit) {
    return res.status(400).json({ error: 'Please fill all required fields' });
  }

  try {
    await addMaterialToProduct(product_id, material_id, quantity_required, unit);
    res.status(201).json({ message: 'Material added to product successfully' });
  } catch (err) {
    console.error('Error adding material to product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await getAllProductsByCategory(category);
    res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching products by category:', err);
    res.status(500).json({ message: 'Error fetching products' });
  }
}

const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
      const product = await getAllProductById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (err) {
      console.error('Error fetching product:', err);
      res.status(500).json({ message: 'Error fetching product' });
    }
  }

  const editAllProduct = async (req, res) => {
    const { id } = req.params;
    const { productName, description, quantity, price, status, category, imageUrl } = req.body;
  
    if (!productName || !description || quantity === undefined || price === undefined) {
      return res.status(400).json({ error: 'Please fill all required fields' });
    }
  
    try {
      const updated = await editProduct(id, productName, description, quantity, price, status, category, imageUrl);
      if (!updated) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ message: 'Product updated successfully' });
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  const deleteAllProduct = async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ message: 'Error deleting product' });
    }
  };
  

module.exports = {getAllProducts, createNewProduct, getProductsByCategory, getProductById, editAllProduct , deleteAllProduct , addProductMaterial};