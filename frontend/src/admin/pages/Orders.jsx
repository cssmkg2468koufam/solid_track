import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import './AppAdmin.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/routes/orderRoutes/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {

  
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/routes/orderRoutes/updateStatus/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      fetchOrders();
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.message);
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5001/routes/orderRoutes/delete/${orderId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete order');
        }

        fetchOrders();
      } catch (err) {
        console.error('Error deleting order:', err);
        setError(err.message);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredOrders = orders.filter(order => 
    order.order_id.toString().includes(searchTerm) ||
    order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid-container">
        <Header />
        <Sidebar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid-container">
        <Header />
        <Sidebar />
        <div className="error-container">
          <div className="error-icon">!</div>
          <h2>Error Loading Orders</h2>
          <p>{error}</p>
          <button onClick={fetchOrders} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid-container">
      <Header />
      <Sidebar />
      <div className="order-page">
        <div className="header">
          <h1>Orders</h1>
          <div className="header-actions">
            <button className="export-btn">Export</button>
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-section">
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Delivery Date</th>
                <th>Location</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.order_id}>
                    <td>#{order.order_id}</td>
                    <td>{order.customer_name || `Customer ID: ${order.customer_id}`}</td>
                    <td>{formatDate(order.delivery_date)}</td>
                    <td>{order.location}</td>
                    <td>Rs. {order.total_amount?.toLocaleString() || '0'}</td>
                    <td>
                      <select 
                        value={order.status} 
                        onChange={(e) => handleStatusUpdate(order.order_id, e.target.value)}
                        className={`status-select ${order.status.toLowerCase()}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="arranged">Arranged</option>
                      </select>
                    </td>
                    <td>
                      <FaTrash 
                        className="delete-icon" 
                        onClick={() => handleDelete(order.order_id)} 
                        title="Delete Order"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    {orders.length === 0 ? 'No orders available' : 'No matching orders found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;