import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './AppAdmin.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
const [materials, setMaterials] = useState([]); // New state for materials
  const [selectedMaterials, setSelectedMaterials] = useState([]); // New state for selected materials
  const [selectedFile, setSelectedFile] = useState(null);
  
  
  const [newProduct, setNewProduct] = useState({
    productName: '',
    description: '',
    quantity: 0,
    price: 0,
    status: 'In Stock',
    category: 'Flower Pots',
    imageUrl: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchMaterials();
  }, []);

  const handleFileChange = (e) => {
  setSelectedFile(e.target.files[0]);
};


  const fetchProducts = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/routes/productRoutes/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const products = await response.json();
      setProducts(products);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await fetch('http://localhost:5001/routes/materialRoutes/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const materials = await response.json();
      setMaterials(materials);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value
    }));
  };

  // Handle material selection change
  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...selectedMaterials];
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: value
    };
    setSelectedMaterials(updatedMaterials);
  };

  // Add a new material row
  const addMaterialRow = () => {
    setSelectedMaterials([...selectedMaterials, { material_id: '', quantity_required: 0 }]);
  };

  // Remove a material row
  const removeMaterialRow = (index) => {
    const updatedMaterials = [...selectedMaterials];
    updatedMaterials.splice(index, 1);
    setSelectedMaterials(updatedMaterials);
  };


  const handleAddProduct = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append('productName', newProduct.productName);
    formData.append('description', newProduct.description);
    formData.append('quantity', newProduct.quantity);
    formData.append('price', newProduct.price);
    formData.append('status', newProduct.status);
    formData.append('category', newProduct.category);
    
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

   
    const response = await fetch('http://localhost:5001/routes/productRoutes/add', {
      method: 'POST',
      body: formData, // pass data as FormData not JSON
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const productData = await response.json();
    
    
    const productId = productData.product_id;
    // Handle materials after product creation
    if (selectedMaterials.length > 0) {
      const materialPromises = selectedMaterials
        .filter(material => material.material_id && material.quantity_required > 0)
        .map(material => 
          fetch('http://localhost:5001/routes/productRoutes/addMaterial', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              product_id: productId,
              material_id: material.material_id,
              quantity_required: material.quantity_required,
            }),
          })
        );

      await Promise.all(materialPromises);
    }

    fetchProducts();
    setNewProduct({
      productName: '',
      description: '',
      quantity: 0,
      price: 0,
      status: 'In Stock',
      category: 'Flower Pots',
      imageUrl: ''
    });
    setSelectedMaterials([]);
    setSelectedFile(null);
    setShowAddModal(false);
  } catch (err) {
    console.error('Error adding product:', err);
    setError(`Error adding product: ${err.message}`);
  }
};

  const handleEdit = (product) => {
    setEditingProduct({
      product_id: product.product_id,
      productName: product.product_name,
      description: product.description,
      quantity: product.quantity,
      price: product.price_of_one_product,
      status: product.status,
      category: product.category,
      imageUrl: product.image_url || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append('productName', editingProduct.productName);
    formData.append('description', editingProduct.description);
    formData.append('quantity', editingProduct.quantity);
    formData.append('price', editingProduct.price);
    formData.append('status', editingProduct.status);
    formData.append('category', editingProduct.category);
    
    if (selectedFile) {
      formData.append('image', selectedFile);
    } else if (editingProduct.imageUrl) {
      formData.append('existingImage', editingProduct.imageUrl);
    }

    const response = await fetch(`http://localhost:5001/routes/productRoutes/edit/${editingProduct.product_id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await response.json();
    fetchProducts();
    setShowEditModal(false);
    setEditingProduct(null);
    setSelectedFile(null);
  } catch (err) {
    console.error('Error updating product:', err);
    setError(err.message);
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/routes/productRoutes/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.message);
    }
  };

 

  return (
    <div className="grid-container">
      <Header />
      <Sidebar />
      <div className="product-page">
        <div className="header">
          <h1>Products</h1>
          <div className="header-actions">
            
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
        {/* Display error or loading messages */}
        {error && <div className="error-message">Error: {error}</div>}
        {isLoading && <div className="loading-message">Loading products...</div>}

        <div className="table-container">
          <table className='product-table'>
            <thead>
              <tr>
                <th>Image</th>
               
                <th>Product Name</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price of one product</th>
                <th>Category</th>
                
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Filter products based on search term and map to table rows */}
              {products
                .filter((product) =>
                  product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((product) => (
                  <tr key={product.product_id}>
                    <td className="product-image-cell">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.product_name} 
                          className="product-thumbnail"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/placeholder-image.png';
                          }}
                        />
                      ) : (
                        <div className="image-placeholder">No Image</div>
                      )}
                    </td>
                  {/* Display product details */}
                    <td>{product.product_name}</td>
                    <td>{product.description}</td>
                    <td>{product.quantity}</td>
                    <td>Rs. {product.price_of_one_product}</td>
                    <td>{product.category}</td>
                    {/* <td>
                      <span className={`status-badge ${product.status.toLowerCase().replace(' ', '-')}`}>
                        {product.status}
                      </span>
                    </td> */}
                    <td>
                      {/* Action buttons for edit and delete */}
                      <FaEdit
                        className="edit-icon"
                        onClick={() => handleEdit(product)}
                        title="Edit Product"
                      />
                      <FaTrash 
                        className="delete-icon" 
                        onClick={() => handleDelete(product.product_id)} 
                        title="Delete Product"
                      />
                    </td>
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
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={newProduct.description}
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
                  <label>Price (Rs)</label>
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
                  <label>Category</label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                  >
                    <option value="Flower Pots">Flower Pots</option>
                    <option value="Lamppost">Lamppost</option>
                    <option value="Concrete Ring">Concrete Ring</option>
                    <option value="Waterlili">Waterlili</option>
                    <option value="Interlock">Interlock</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                {/* Handle image preview */}
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={newProduct.status}
                    onChange={handleInputChange}
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Required Materials</label>
                  <button type="button" onClick={addMaterialRow} className="add-material-btn">
                    + Add Material
                  </button>
                  {/* Render material selection rows */}
                  {selectedMaterials.map((material, index) => (
                    <div key={index} className="material-row">
                      <select
                        value={material.material_id}
                        onChange={(e) => handleMaterialChange(index, 'material_id', e.target.value)}
                        required
                      >
                        <option value="">Select Material</option>
                        {materials.map(mat => (
                          <option key={mat.material_id} value={mat.material_id}>
                            {mat.name} ({mat.stock})
                          </option>
                        ))}
                      </select>
                      
                      <input
                        type="number"
                        value={material.quantity_required}
                        onChange={(e) => handleMaterialChange(index, 'quantity_required', e.target.value)}
                        min="0"
                        step="0.01"
                        placeholder="Quantity"
                        required
                      />
                      
                      
                      <button 
                        type="button" 
                        onClick={() => removeMaterialRow(index)}
                        className="remove-material-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
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

        {/* Edit Product Modal */}
{showEditModal && editingProduct && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Edit Product</h2>
      <form onSubmit={handleUpdateProduct}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="productName"
            value={editingProduct.productName}
            onChange={(e) => setEditingProduct({...editingProduct, productName: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={editingProduct.description}
            onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={editingProduct.quantity}
            onChange={(e) => setEditingProduct({...editingProduct, quantity: Number(e.target.value)})}
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label>Price (Rs)</label>
          <input
            type="number"
            name="price"
            value={editingProduct.price}
            onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={editingProduct.category}
            onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
          >
            <option value="Flower Pots">Flower Pots</option>
            <option value="Lamppost">Lamppost</option>
            <option value="Concrete Ring">Concrete Ring</option>
            <option value="Waterlili">Waterlili</option>
            <option value="Interlock">Interlock</option>
          </select>
        </div>
        <div className="form-group">
          <label>Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          {editingProduct.imageUrl && (
            <div className="image-preview">
              <img 
                src={editingProduct.imageUrl} 
                alt="Preview" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/placeholder-image.png';
                }}
              />
              <input
                type="hidden"
                name="existingImage"
                value={editingProduct.imageUrl}
              />
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={editingProduct.status}
            onChange={(e) => setEditingProduct({...editingProduct, status: e.target.value})}
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
        <div className="modal-actions">
          <button type="submit" className="save-btn">Update</button>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => {
              setShowEditModal(false);
              setEditingProduct(null);
            }}
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