import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerOrder.css';

const CustomerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchOrders();
  }, [navigate]);

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

     // Now compute total for each order
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
      case 'pending': return 'status-badge-pending';
      case 'approved': return 'status-badge-approved';
      case 'shipped': return 'status-badge-shipped';
      case 'delivered': return 'status-badge-delivered';
      case 'cancelled': return 'status-badge-cancelled';
      default: return 'status-badge-pending';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">!</div>
        <h2>Error Loading Orders</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="customer-orders-page">
      <h1>Your Orders</h1>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/customerproducts')} className="shop-now-btn">
            Shop Now
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.order_id} className="order-card">
              <div className="order-header">
                <div className="order-meta">
                  <span className="order-id">Order #{order.order_id}</span>
                  <span className="order-date">Placed on {formatDate(order.created_at)}</span>
                </div>
                <div className={`order-status ${getStatusBadgeClass(order.status)}`}>
  Status: {order.status}
</div>
              </div>

              {order.items.map((item, index) => (
                <div key={index} className="order-details">
                  <div className="product-info">
                    <img 
                      src={item.image_url || 'https://via.placeholder.com/100?text=Product'} 
                      alt={item.product_name} 
                      className="product-image" 
                    />
                    <div className="product-details">
                      <h3>{item.product_name}</h3>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: Rs. {item.price_of_one_product.toLocaleString()}</p>
                      <p>Subtotal: Rs. {(item.quantity * item.price_of_one_product).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="order-summary">
                <div className="summary-row">
                  <span>Delivery Date:</span>
                  <span>{formatDate(order.delivery_date)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Location:</span>
                  <span>{order.location}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>Rs. {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrder;
