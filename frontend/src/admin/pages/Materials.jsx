import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AppAdmin.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Materials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    material_id: '',
    name: '',
    supplier: '',
    quantity: '',
    price: '',
    purchase_date: '',
    stock: 'In Stock'
  });
  const [selectedExistingMaterial, setSelectedExistingMaterial] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState({
    material_id: '',
    name: '',
    supplier: '',
    quantity: '',
    price: ''
  });

  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString.split('T')[0];
    }
  };

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/routes/materialRoutes/get');
      if (response.ok) {
        const data = await response.json();
        setMaterials(Array.isArray(data) ? data : []);
      } else {
        throw new Error('Failed to fetch materials');
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredMaterials = materials.filter(material => {
    if (!material) return false;
    const searchLower = searchQuery.toLowerCase();
    return (
      (material.name?.toLowerCase() || '').includes(searchLower) ||
      (material.material_id?.toLowerCase() || '').includes(searchLower) ||
      (material.supplier?.toLowerCase() || '').includes(searchLower)
    );
  });

  const handleAddMaterial = () => {
    setShowAddModal(true);
    setSelectedExistingMaterial(null);
    setNewMaterial({
      material_id: '',
      name: '',
      supplier: '',
      quantity: '',
      price: '',
      purchase_date: '',
      stock: 'In Stock'
    });
  };

  const handleExportToExcel = () => {
    console.log('Export to Excel clicked');
  };

  const handleViewDetails = () => {
    navigate('/details', { state: { materials } });
  };

  const handleEdit = (material) => {
    setEditingMaterial({
      material_id: material.material_id,
      name: material.name,
      supplier: material.supplier,
      quantity: material.quantity,
      price: material.price
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`http://localhost:5001/routes/materialRoutes/update/${editingMaterial.material_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editingMaterial.name,
        supplier: editingMaterial.supplier,
        quantity: editingMaterial.quantity,
        price: editingMaterial.price,
        purchase_date: new Date().toISOString().split('T')[0] // or get from editingMaterial if available
      })
    });

    if (res.ok) {
      await fetchMaterials();
      setShowEditModal(false);
      setEditingMaterial({
        material_id: '',
        name: '',
        supplier: '',
        quantity: '',
        price: ''
      });
    } else {
      const errorData = await res.json();
      console.error('Update error:', errorData);
    }
  } catch (error) {
    console.error('Error while updating material:', error);
  }
};

  const handleEditChange = (e) => {
    setEditingMaterial({
      ...editingMaterial,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    try {
      const res = await fetch(`http://localhost:5001/routes/materialRoutes/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchMaterials();
      } else {
        console.error("Failed to delete material");
      }
    } catch (error) {
      console.error("Error while deleting material:", error);
    }
  };

  const handleChange = (e) => {
    setNewMaterial({
      ...newMaterial,
      [e.target.name]: e.target.value,
    });
  };

  const handleExistingMaterialSelect = (e) => {
    const materialId = e.target.value;
    if (materialId === 'new') {
      setSelectedExistingMaterial(null);
      setNewMaterial({
        material_id: '',
        name: '',
        supplier: '',
        quantity: '',
        price: '',
        purchase_date: '',
        stock: 'In Stock'
      });
    } else {
      const selectedMaterial = materials.find(m => m.material_id === materialId);
      if (selectedMaterial) {
        setSelectedExistingMaterial(selectedMaterial);
        setNewMaterial({
          ...selectedMaterial,
          quantity: '',
          price: selectedMaterial.price, // Keep the existing price as default
          purchase_date: new Date().toISOString().split('T')[0] // Set current date as default
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedExistingMaterial) {
        // Update existing material's quantity and price
        const updatedQuantity = parseFloat(selectedExistingMaterial.quantity) + parseFloat(newMaterial.quantity);
        const res = await fetch(`http://localhost:5001/routes/materialRoutes/update/${selectedExistingMaterial.material_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...selectedExistingMaterial,
            quantity: updatedQuantity,
            price: newMaterial.price,
            purchase_date: newMaterial.purchase_date
          })
        });
        
        if (res.ok) {
          await fetchMaterials();
          setShowAddModal(false);
          setNewMaterial({
            material_id: '',
            name: '',
            supplier: '',
            quantity: '',
            price: '',
            purchase_date: '',
            stock: 'In Stock'
          });
        }
      } else {
        // Create new material
        const res = await fetch('http://localhost:5001/routes/materialRoutes/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMaterial)
        });

        if (res.ok) {
          await fetchMaterials();
          setShowAddModal(false);
          setNewMaterial({
            material_id: '',
            name: '',
            supplier: '',
            quantity: '',
            price: '',
            purchase_date: '',
            stock: 'In Stock'
          });
        }
      }
    } catch (error) {
      console.error('Error while adding material:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading materials...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="grid-container">
      <Header />
      <Sidebar />
      <div className="materials-page">
        <div className="header">
          <h1>Raw Materials</h1>
          <div className="header-actions">
            
            <button className="add-btn" onClick={handleAddMaterial}>+ Add Material</button>
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        
        <div className="table-container">
          <table className="materials-table">
            <thead>
              <tr>
                <th>Material ID</th>
                <th>Material Name</th>
                <th>Supplier</th>
                <th>Quantity(Kg)</th>
                <th>Price</th>
                <th>Purchase Date</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((material, index) => (
                  <tr key={index}>
                    <td>{material?.material_id || ''}</td>
                    <td>{material?.name || ''}</td>
                    <td>{material?.supplier || ''}</td>
                    <td>{material?.quantity || ''}</td>
                    <td>{material?.price || ''}</td>
                    <td>{formatDate(material?.purchase_date) || ''}</td>
                    <td>
                      <span className={`status-badge ${material?.stock === 'In Stock' ? 'in-stock' : 'low-stock'}`}>
                        {material?.stock || ''}
                      </span>
                    </td>
                    <td>
                      <FaEdit className="edit-icon" onClick={() => handleEdit(material)} />
                      <FaTrash className="delete-icon" onClick={() => handleDelete(material?.material_id)} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-data">No materials found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className='unit-details'>
          <p>Sand 1 cube = 1700kg</p>
        </div>


        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Add Material</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Select Existing Material</label>
                  <select 
                    onChange={handleExistingMaterialSelect}
                    defaultValue="new"
                  >
                    <option value="new">Add New Material</option>
                    {materials.map(material => (
                      <option key={material.material_id} value={material.material_id}>
                        {material.name} ({material.material_id})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedExistingMaterial ? (
                  <>
                    <div className="form-group">
                      <label>Material ID</label>
                      <input 
                        type="text" 
                        value={selectedExistingMaterial.material_id} 
                        readOnly 
                      />
                    </div>
                    <div className="form-group">
                      <label>Material Name</label>
                      <input 
                        type="text" 
                        value={selectedExistingMaterial.name} 
                        readOnly 
                      />
                    </div>
                    <div className="form-group">
                      <label>Supplier</label>
                      <input 
                        type="text" 
                        value={selectedExistingMaterial.supplier} 
                        readOnly 
                      />
                    </div>
                    <div className="form-group">
                      <label>Current Quantity</label>
                      <input 
                        type="text" 
                        value={selectedExistingMaterial.quantity} 
                        readOnly 
                      />
                    </div>
                    <div className="form-group">
                      <label>Additional Quantity</label>
                      <input 
                        type="number" 
                        name="quantity" 
                        value={newMaterial.quantity} 
                        onChange={handleChange} 
                        min="0" 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Full Price </label>
                      <input 
                        type="number" 
                        name="price" 
                        value={newMaterial.price} 
                        onChange={handleChange} 
                        min="0" 
                        step="0.01" 
                        required 
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label>Material ID</label>
                      <input 
                        type="text" 
                        name="material_id" 
                        value={newMaterial.material_id} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Material Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={newMaterial.name} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Supplier</label>
                      <input 
                        type="text" 
                        name="supplier" 
                        value={newMaterial.supplier} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Quantity(kg)</label>
                      <input 
                        type="number" 
                        name="quantity" 
                        value={newMaterial.quantity} 
                        onChange={handleChange} 
                        min="0" 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label> Full Price </label>
                      <input 
                        type="number" 
                        name="price" 
                        value={newMaterial.price} 
                        onChange={handleChange} 
                        min="0" 
                        step="0.01" 
                        required 
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>Purchase Date</label>
                  <input 
                    type="date" 
                    name="purchase_date" 
                    value={newMaterial.purchase_date} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="modal-actions">
                  <button type="submit" className="save-btn">Save</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Edit Material</h2>
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label>Material ID</label>
                  <input type="text" value={editingMaterial.material_id} disabled />
                </div>
                <div className="form-group">
                  <label>Material Name</label>
                  <input type="text" name="name" value={editingMaterial.name} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>Supplier</label>
                  <input type="text" name="supplier" value={editingMaterial.supplier} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input type="number" name="quantity" value={editingMaterial.quantity} onChange={handleEditChange} min="0" required />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input type="number" name="price" value={editingMaterial.price} onChange={handleEditChange} min="0" step="0.01" required />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="save-btn">Update</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Materials;