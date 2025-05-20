import React from 'react';
import { FaChartLine, FaFileInvoiceDollar, FaBoxes, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './AppAdmin.css';

const Reports = () => {
  const navigate = useNavigate();

  const reportCards = [
    {
      title: 'Sales Reports',
      description: 'Generate detailed sales reports by date range, product, or customer',
      icon: <FaChartLine className="report-icon" />,
      path: '/salesreport',
      color: '#3498db'
    },
    {
      title: 'Order Reports',
      description: 'View and analyze order status, fulfillment, and history',
      icon: <FaFileInvoiceDollar className="report-icon" />,
      path: '/reports-orders',
      color: '#2ecc71'
    },
    {
      title: 'Inventory Reports',
      description: 'Track stock levels, movements, and inventory valuation',
      icon: <FaBoxes className="report-icon" />,
      path: '/reports/inventory',
      color: '#e67e22'
    },
    {
      title: 'Customer Reports',
      description: 'Analyze customer behavior, purchases, and demographics',
      icon: <FaUsers className="report-icon" />,
      path: '/reports/customers',
      color: '#9b59b6'
    },
  ];

  return (
    <div className="grid-container">
      <Header />
      <Sidebar />
      <div className="reports-page">
        <div className="reports-header">
          <h1>Reports Dashboard</h1>
          <p>Select a report type to view detailed analytics</p>
        </div>

        <div className="report-cards-container">
          {reportCards.map((card, index) => (
            <div 
              key={index} 
              className="report-card"
              style={{ borderTop: `4px solid ${card.color}` }}
              onClick={() => navigate(card.path)}
            >
              <div className="card-icon" style={{ color: card.color }}>
                {card.icon}
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <div className="card-footer">
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;