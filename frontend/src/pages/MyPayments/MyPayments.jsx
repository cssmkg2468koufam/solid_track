import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyPayments.css';

const MyPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'pending', 'advanced'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const customerData = JSON.parse(localStorage.getItem("customer"));
        const customer_id = customerData?.customer_id;

        if (!customer_id) {
          throw new Error('Customer information not found');
        }

        const response = await fetch(
          `http://localhost:5001/routes/paymentRoutes/customer-payments/${customer_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch payment details');
        }

        const data = await response.json();
        setPayments(data.payments || []);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    if (filter === 'completed') return payment.status === 'paid';
    if (filter === 'pending') return payment.status === 'pending';
    if (filter === 'advanced') return payment.status === 'advanced-paid';
    return true;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return `Rs. ${parseFloat(amount).toLocaleString()}`;
  };

  const handleViewInvoice = (orderId) => {
    navigate(`/invoice/${orderId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your payment history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Payments</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="my-payments-container">
      <h1>My Payment History</h1>
      
      <div className="payment-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Payments
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`filter-btn ${filter === 'advanced' ? 'active' : ''}`}
          onClick={() => setFilter('advanced')}
        >
          Advanced Payments
        </button>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="no-payments">
          <p>No payments found</p>
          {filter !== 'all' && (
            <button 
              className="clear-filter-btn"
              onClick={() => setFilter('all')}
            >
              Show all payments
            </button>
          )}
        </div>
      ) : (
        <div className="payments-list">
          {filteredPayments.map((payment) => (
            <div key={payment.payment_id} className="payment-card">
              <div className="payment-header">
                <h3>Order #{payment.order_id}</h3>
                <span className={`status-badge ${payment.status}`}>
                  {payment.status === 'paid' ? 'Completed' : 
                   payment.status === 'advanced-paid' ? 'Advanced' : 
                   'Pending'}
                </span>
              </div>
              
              <div className="payment-details">
                <div className="detail-row">
                  <span>Date:</span>
                  <span>{formatDate(payment.payment_date)}</span>
                </div>
                <div className="detail-row">
                  <span>Amount:</span>
                  <span>{formatCurrency(payment.amount)}</span>
                </div>
                {payment.status === 'advanced-paid' && payment.remain_balance && (
                  <div className="detail-row">
                    <span>Remaining Balance:</span>
                    <span>{formatCurrency(payment.remain_balance)}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span>Method:</span>
                  <span>{payment.payment_method || 'Online'}</span>
                </div>
              </div>
              
              <div className="payment-actions">
                <button 
                  onClick={() => handleViewInvoice(payment.order_id)}
                  className="view-invoice-btn"
                >
                  View Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPayments;