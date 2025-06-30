import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import './CustomerOrder.css';

const stripePromise = loadStripe('pk_test_51RNVXHF2XYRh3d2iLEcpEx2QodkbOO76ENgN6RffgmKp90kgpnXvSt0BInWFcBfXfivtNXquLFXO95emR40wedBV005zYzTaG4');

const CustomerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const customerData = JSON.parse(localStorage.getItem("customer"));
      const customer_id = customerData?.customer_id;

      const response = await fetch(`http://localhost:5001/routes/orderRoutes/customer/${customer_id}`, {
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
      const grouped = groupOrders(data);
      setOrders(grouped);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const groupOrders = (rawOrders) => {
    const grouped = {};

    rawOrders.forEach(item => {
      if (!grouped[item.order_id]) {
        grouped[item.order_id] = {
          order_id: item.order_id,
          customer_id: item.customer_id,
          status: item.order_status,
          delivery_date: item.delivery_date,
          location: item.location,
          created_at: item.created_at,
          remain_balance: item.remain_balance,
          items: []
        };
      }

      grouped[item.order_id].items.push({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        total_price: item.total_price,
        price_of_one_product: item.price_of_one_product,
        image_url: item.image_url
      });
    });

    Object.values(grouped).forEach(order => {
      order.total = order.items.reduce(
        (sum, item) => sum + item.quantity * item.price_of_one_product,
        0
      );
    });

    return Object.values(grouped);
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'co-status-badge-pending';
      case 'approved': return 'co-status-badge-approved';
      case 'paid': return 'co-status-badge-shipped';
      case 'pending_pay': return 'co-status-badge-delivered';
      case 'cancelled': return 'co-status-badge-cancelled';
      default: return 'co-status-badge-pending';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleProceedToPayment = (order_id, total) => {
    navigate('/checkout', { state: { order_id, total } });
  };

  const handleProceedToAdvancePayment = (order_id, remain_balance) => {
    navigate('/checkout-advance', { state: { order_id, remain_balance } });
  };

  const canCancelOrder = (status) => {
    const lowerStatus = status.toLowerCase();
    return lowerStatus === 'pending' || lowerStatus === 'approved' || lowerStatus === 'advanced-paid';
  };

  const handleCancelRequest = (orderId) => {
    setOrderToCancel(orderId);
    setShowCancelConfirm(true);
  };

  const confirmCancelOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
// Validate orderToCancel
      const response = await fetch(`http://localhost:5001/routes/orderRoutes/cancel/${orderToCancel}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      await fetchOrders();
      setShowCancelConfirm(false);
      setOrderToCancel(null);
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="co-loading-container">
        <div className="co-loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="co-error-container">
        <div className="co-error-icon">!</div>
        <h2>Error Loading Orders</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="co-retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="co-page-container">
      <h1 className="co-page-title">Your Orders</h1>
      
      {showCancelConfirm && (
        <div className="co-modal-overlay">
          <div className="co-confirmation-modal">
            <h3>Confirm Cancellation</h3>
            <p>Are you sure you want to cancel this order?</p>
            <div className="co-modal-actions">
              <button 
                onClick={() => setShowCancelConfirm(false)}
                className="co-cancel-btn"
              >
                No, Keep Order
              </button>
              <button 
                onClick={confirmCancelOrder}
                className="co-confirm-btn"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
      
      {orders.length === 0 ? (
        <div className="co-no-orders">
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/customerproducts')} className="co-shop-now-btn">
            Shop Now
          </button>
        </div>
      ) : (
        <div className="co-orders-list">
          {orders.map(order => (
            <div key={order.order_id} className="co-order-card">
              <div className="co-order-header">
                <div className="co-order-meta">
                  {/* <span className="co-order-id">Order #{order.order_id}</span> */}
                  <span className="co-order-date">Placed on {formatDate(order.created_at)}</span>
                  <span className="co-contact-btn">Contact us - 0773875830</span>
                </div>
                <div className={`co-order-status ${getStatusBadgeClass(order.status)}`}>
                  Status: {order.status}
                </div>
              </div>

              {order.items.map((item, index) => (
                <div key={index} className="co-order-details">
                  <div className="co-product-info">
                    <img 
                      src={item.image_url || 'https://via.placeholder.com/100?text=Product'} 
                      alt={item.product_name} 
                      className="co-product-image" 
                    />
                    <div className="co-product-details">
                      <h3>{item.product_name}</h3>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: Rs. {item.price_of_one_product.toLocaleString()}</p>
                      <p>Subtotal: Rs. {(item.quantity * item.price_of_one_product).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="co-order-summary">
                <div className="co-summary-row">
                  <span>Delivery Date:</span>
                  <span>{formatDate(order.delivery_date)}</span>
                </div>
                {/* <div className="co-summary-row">
                  <span>Delivery Location:</span>
                  <span>{order.location}</span>
                </div> */}
                <div className="co-summary-row co-total-row">
                  <span>Total:</span>
                  <span>Rs. {order.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="co-order-actions">
                {order.status.toLowerCase() === 'approved' && (
                  <div className="co-payment-notice">
                    <button 
                      onClick={() => handleProceedToPayment(order.order_id, order.total)}
                      className="co-proceed-payment-btn"
                    >
                      Proceed to Payment
                    </button>
                    <p className="co-advance-notice">You have to pay 30% advance before arranged the order</p>
                  </div>
                )}
                {order.status.toLowerCase() === 'advanced-paid' && (
                  <div className="co-payment-notice">
                    <button 
                      onClick={() => handleProceedToAdvancePayment(order.order_id, order.remain_balance)}
                      className="co-proceed-payment-btn"
                    >
                      Pay Remaining Balance
                    </button>
                    <p className="co-balance-notice">Remaining balance: Rs. {(order.remain_balance || 0)}</p>
                  </div>
                )}
                
                {canCancelOrder(order.status) && (
                  <button 
                    onClick={() => handleCancelRequest(order.order_id)}
                    className="co-cancel-order-btn"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrder;