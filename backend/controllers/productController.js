const { getAll, createProduct, getAllProductsByCategory , getAllProductById , editProduct, deleteProduct , addMaterialToProduct} = require('../models/productModel');
const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const getAllProducts = async (req, res) => { 
  try {
    const products = await getAll();
    // Update image URLs to include full path
    const productsWithFullUrls = products.map(product => ({
      ...product,
      image_url: product.image_url ? `${req.protocol}://${req.get('host')}${product.image_url}` : null
    }));
    res.status(200).json(productsWithFullUrls);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

const createNewProduct = async (req, res) => {
  const { productName, description, quantity, price, status, category } = req.body;
  
  if (!productName || !description || quantity === undefined || price === undefined) {
    return res.status(400).json({ error: 'Please fill all required fields' });
  }

  try {
    let imageUrl = '';
    
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const insertId = await createProduct(
      productName, 
      description, 
      quantity, 
      price, 
      status, 
      category, 
      imageUrl
    );
    
    res.status(201).json({ 
      message: 'Product created successfully',
      product_id: insertId,
      insertId 
    });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addProductMaterial = async (req, res) => {
  const { product_id, material_id, quantity_required } = req.body;
  console.log(req.body);

  if (!product_id || !material_id || quantity_required === undefined ) {
    return res.status(400).json({ error: 'Please fill all required fields' });
  }

  try {
    await addMaterialToProduct(product_id, material_id, quantity_required);
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
    // Update image URLs to include full path
    const productsWithFullUrls = products.map(product => ({
      ...product,
      image_url: product.image_url ? `${req.protocol}://${req.get('host')}${product.image_url}` : null
    }));
    res.status(200).json(productsWithFullUrls);
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
      // Update image URL to include full path
      product.image_url = product.image_url ? `${req.protocol}://${req.get('host')}${product.image_url}` : null;
      res.status(200).json(product);
    } catch (err) {
      console.error('Error fetching product:', err);
      res.status(500).json({ message: 'Error fetching product' });
    }
}

const editAllProduct = async (req, res) => {
  const { id } = req.params;
  const { productName, description, quantity, price, status, category } = req.body;

  if (!productName || !description || quantity === undefined || price === undefined) {
    return res.status(400).json({ error: 'Please fill all required fields' });
  }

  try {
    let imageUrl = '';
    
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.existingImage) {
      imageUrl = req.body.existingImage;
    }

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

module.exports = {
  getAllProducts, 
  createNewProduct, 
  getProductsByCategory, 
  getProductById, 
  editAllProduct, 
  deleteAllProduct, 
  addProductMaterial,
  upload
};