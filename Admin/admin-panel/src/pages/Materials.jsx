import React, { useState } from 'react';
import '../App.css'

const Materials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [materials, setMaterials] = useState([
    { id: 'MAT001', name: 'Material 1', supplier: 'Supplier A', quantity: 100, purchaseDate: '2025-02-15', stock: 'In Stock' },
    { id: 'MAT002', name: 'Material 2', supplier: 'Supplier B', quantity: 75, purchaseDate: '2025-03-01', stock: 'Low Stock' },
    { id: 'MAT003', name: 'Material 3', supplier: 'Supplier C', quantity: 50, purchaseDate: '2025-03-10', stock: 'In Stock' },
  ]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredMaterials = materials.filter(material => 
    material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMaterial = () => {
    console.log('Add new material clicked');
    // Implement your add material functionality here
  };

  const handleExportToExcel = () => {
    console.log('Export to Excel clicked');
    // Implement your export functionality here
  };

  return (
    <div className="materials-page">
      <div className="header">
        <h1>Raw Materials</h1>
        <div className="header-actions">
          <button className="export-btn" onClick={handleExportToExcel}>Export to Excel</button>
          <button className="add-btn" onClick={handleAddMaterial}>+ New Material</button>
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
              <th>Supplier ID</th>
              <th>Quantity</th>
              <th>Purchase Date</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((material) => (
                <tr key={material.id}>
                  <td>{material.id}</td>
                  <td>{material.name}</td>
                  <td>{material.supplier}</td>
                  <td>{material.quantity}</td>
                  <td>{material.purchaseDate}</td>
                  <td>
                    <span className={`status-badge ${material.stock === 'In Stock' ? 'in-stock' : 'low-stock'}`}>
                      {material.stock}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">No materials found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Materials;