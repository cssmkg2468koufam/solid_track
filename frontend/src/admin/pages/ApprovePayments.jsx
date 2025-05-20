import React, { useState, useEffect } from 'react';
import './AppAdmin.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const ApprovePayment = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/routes/paymentRoutes/get-pending', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch pending payments');

      const data = await response.json();
      setPayments(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const handleStatusUpdate = async (paymentId, newStatus) => {

    console.log("Updating payment status:", paymentId, newStatus);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/routes/paymentRoutes/updateStatus/${paymentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update payment status');
      }
      fetchPendingPayments();

      // Optimistically update the UI
      setPayments(prevPayments => 
        prevPayments.map(payment => 
          payment.payment_id === paymentId ? { ...payment, status: newStatus } : payment
        )
      );

      // If status is paid, also update the order status
      if (newStatus === 'paid') {
        const payment = payments.find(p => p.payment_id === paymentId);
        if (payment) {
          await updateOrderStatus(payment.order_id, 'paid');
        }
      }
      
      // Refresh the data to ensure consistency
      fetchPendingPayments();
    } catch (err) {
      setError(err.message);
      // Revert the UI if the update failed
      fetchPendingPayments();
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {

    console.log("Updating order status:", orderId, newStatus);
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
        throw new Error('Failed to update order status');
      }
      
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-GB');

  const filtered = payments.filter(p =>
    p.order_id.toString().includes(searchTerm) ||
    p.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid-container">
        <Header />
        <Sidebar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading payments...</p>
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
          <h2>Error Loading Payments</h2>
          <p>{error}</p>
          <button onClick={fetchPendingPayments} className="retry-btn">
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
          <h1>Payment Approval</h1>
          <div className="header-actions">
            
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="table-section">
          <table className="order-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Payment Method</th>
                <th>Receipt</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr key={p.payment_id}>
                    <td>{p.payment_id}</td>
                    <td>{p.order_id}</td>
                    <td>{p.customer_name}</td>
                    <td>Rs. {p.amount.toLocaleString()}</td>
                    <td>{formatDate(p.created_at)}</td>
                    <td>{p.payment_method}</td>
                    <td>
                      {p.img_url && (
                        <a 
                          href={`http://localhost:5001${p.img_url}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="receipt-link"
                        >
                          View Receipt
                        </a>
                      )}
                    </td>
                    <td>
                      <select
  value={p.status}
  onChange={(e) => handleStatusUpdate(p.payment_id, e.target.value)}
  className={`status-select ${(p.status || 'pending').toLowerCase()}`}
>
  <option value="pending">Pending</option>
  <option value="paid">Paid</option>
  <option value="rejected">Rejected</option>
</select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    {payments.length === 0 ? 'No payments available' : 'No matching payments found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApprovePayment;