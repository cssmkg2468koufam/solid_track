import React, { useState, useEffect } from 'react';
import './AppAdmin.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    quantity: 0,
    price: 0,
    status: 'In Stock'
  });

  // Fetch products from backend
  useEffect(()=>{
  fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setError(null);
    try {
      const response = await fetch('http://localhost:5001/routes/productRoutes/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const   products = await response.json();
      setProducts(products);
      console.log('Fetched products:', products);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };





  // Handle input change for new product
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value
    }));
  };

  // // Format date for display
  // const formatDate = (dateString) => {
  //   if (!dateString) return '';
  //   try {
  //     const date = new Date(dateString);
  //     return date.toISOString().split('T')[0];
  //   } catch (e) {
  //     console.error('Error formatting date:', e);
  //     return dateString.split('T')[0];
  //   }
  // };

  // Add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/routes/productRoutes/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdProduct = await response.json();
      console.log('Created product:', createdProduct);
      setProducts([...products, createdProduct]);
      fetchProducts(); // Refresh the product list
      setNewProduct({
        productName: '',
        quantity: 0,
        price: 0,
        status: 'In Stock'
      });
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.message);
    }
  };

  // Export to Excel (mock functionality)
  const handleExport = () => {
    alert('Export functionality would be implemented here');
  };

  return (
    <div className="grid-container">
        <Header />
        <Sidebar />
    <div className="product-page">
      <div className="header">
        <h1>Products</h1>
        <div className="header-actions">
          <button className="btn export" onClick={handleExport}>Export</button>
          <button className="btn new" onClick={() => setShowAddModal(true)}>+ New Product</button>
        </div>
      </div>

      <input
        type="text"
        className="search-box"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {error && <div className="error-message">Error: {error}</div>}

      <div className="table-container">
        <table className='product-table'>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
  {products
    .filter((product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((product) => (
      <tr key={product.product_id}>
        <td>{product.product_id}</td>
        <td>{product.product_name}</td>
        <td>{product.quantity}</td>
        <td>{product.price_of_one_product}</td>
        <td>{product.status}</td>
      </tr>
  ))}
</tbody>

        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={newProduct.productName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={newProduct.quantity}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={newProduct.status}
                  onChange={handleInputChange}
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Low Stock">Low Stock</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Products;