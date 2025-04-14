import React from 'react';
import '../App.css';

const materials = [
  {
    id: 1,
    name: 'Stainless Steel',
    supplier: 'MetalWorks Inc.',
    quantity: '450 kg',
    color: '#4a6fa5'
  },
  {
    id: 2,
    name: 'Copper Wire',
    supplier: 'ElectroCables Ltd.',
    quantity: '1200 m',
    color: '#c57b57'
  },
  {
    id: 3,
    name: 'Aluminum Sheets',
    supplier: 'Alloy Distributors',
    quantity: '85 sheets',
    color: '#a5a5a5'
  },
  {
    id: 4,
    name: 'PVC Pipes',
    supplier: 'Plastico',
    quantity: '320 units',
    color: '#6bbf59'
  }
];

const Details = () => {
  
  return (
    <div className="details-container">
      <h1 className="details-title">Material Inventory</h1>
      
      <div className="materials-grid">
        {materials.map((material) => (
          <div 
            className="material-card" 
            key={material.id}
            style={{ borderTop: `4px solid ${material.color}` }}
          >
            <div className="card-content">
              <h2 className="material-name">{material.name}</h2>
              <p className="supplier-name">
                <span className="label">Supplier:</span> {material.supplier}
              </p>
              <p className="material-quantity">
                <span className="label">Quantity:</span> {material.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Details;