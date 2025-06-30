import React, { useState, useEffect } from 'react';
import './AppAdmin.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    supplier_id: '',
    supplier_name: '',
    raw_material: '',
    mobile: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch suppliers from backend
  const fetchSuppliers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5001/routes/supplierRoutes/get',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
        );
      if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
      }
      const data = await response.json();
      setSuppliers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5001/routes/supplierRoutes/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add supplier');
      }

      const newSupplier = await response.json();
      setSuppliers(prev => [...prev, newSupplier]);
      setFormData({
        supplier_id: '',
        supplier_name: '',
        raw_material: '',
        mobile: ''
      });
      fetchSuppliers(); // Refresh the list
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSupplier = () => {
    setShowAddModal(true);
  };

  const handleExportToExcel = () => {
    console.log('Export to Excel clicked');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.supplier_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.raw_material.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (supplier) => {
    setFormData({
      supplier_id: supplier.supplier_id,
      supplier_name: supplier.supplier_name,
      raw_material: supplier.raw_material,
      mobile: supplier.mobile
    });
    setShowAddModal(true);
  };

  const handleDelete = async (supplierId) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5001/routes/supplierRoutes/delete/${supplierId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete supplier');
      }

      setSuppliers(prev => prev.filter(supplier => supplier.supplier_id !== supplierId));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid-container">
        <Header />
        <Sidebar />
    <div className="supplier-page">
      <div className="header">
        <h1>Suppliers</h1>
        <div className="header-actions">
          
          <button className="add-btn" onClick={handleAddSupplier}>+ New Supplier</button>
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
        <table className="supplier-table">
          <thead>
            <tr>
              <th>Supplier ID</th>
              <th>Supplier Name</th>
              <th>Material</th>
              <th>Mobile</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier, index) => (
                <tr key={index}>
                  <td>{supplier?.supplier_id || ''}</td>
                  <td>{supplier?.supplier_name || ''}</td>
                  <td>{supplier?.raw_material || ''}</td>
                  <td>{supplier?.mobile || ''}</td>
                  <td>
                    {/* <FaEdit className="edit-icon" onClick={() => handleEdit(supplier)} /> */}
                    <FaTrash className="delete-icon" onClick={() => handleDelete(supplier?.supplier_id)} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">No suppliers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Supplier</h2>
            <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Supplier ID</label>
              <input type="text" name="supplier_id" value={formData.supplier_id} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Supplier Name</label>
              <input type="text" name="supplier_name" value={formData.supplier_name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Material</label>
              <input type="text" name="raw_material" value={formData.raw_material} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Mobile</label>
              <input type="number" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
            </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
    </div>
  );
};

export default Supplier;