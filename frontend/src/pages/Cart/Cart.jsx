import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [location, setLocation] = useState(''); // Added missing location state
  const [orderMessage, setOrderMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const customerData = JSON.parse(localStorage.getItem("customer"));
        const customer_id = customerData?.customer_id;
  
        const response = await fetch(`http://localhost:5001/routes/cartRoutes/get/${customer_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid cart data format');
        }
        
        const flattenedItems = data.flat();
        const validatedItems = flattenedItems.map(item => ({
          id: item.id || '', 
          productId: item.product_id || '',
          name: item.product_name || 'Unknown Product',
          price: Number(item.price_of_one_product) || 0,
          image: item.image_url || '',
          customer_id: item.customer_id,
          selected: false,
          quantity: 1 // Default quantity set to 1, ignoring any database quantity
        }));
        
        setCartItems(validatedItems);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  useEffect(() => {
    const selectedTotal = cartItems
      .filter(item => item.selected)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(selectedTotal);
  }, [cartItems]);

  const handleRemoveItem = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      // Fixed: Use correct endpoint URL matching the route in CartRoutes.js
      const response = await fetch(`http://localhost:5001/routes/cartRoutes/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      // Optimistically update the UI before waiting for response
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    
    // Parse the response to check for success message
    const data = await response.json();
    if (data.message !== 'Cart item deleted successfully') {
      throw new Error('Item removal not confirmed');
    }

      const updatedItems = cartItems.filter(item => item.id !== id);
      setCartItems(updatedItems);
    } catch (err) {
      console.error('Error removing item:', err);
      setError(err.message);
    }
  };

  

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/routes/cartRoutes/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      setCartItems([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err.message);
    }
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1){
      alert("Quantity cannot be less than 1");
      return; // Added return to prevent updating with invalid quantity
    }

    const updatedItems = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
  };

  const toggleItemSelection = (id) => {
    const updatedItems = cartItems.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setCartItems(updatedItems);
  };

  const handlePlaceOrder = () => {
    const token = localStorage.getItem("token");
    const selectedItems = cartItems.filter(item => item.selected);

    if (selectedItems.length === 0) {
      setOrderMessage('Please select at least one item to place order');
      setTimeout(() => setOrderMessage(''), 3000);
      return;
    }

    if (!token) {
      setShowLoginPopup(true);
    } else {
      setShowOrderConfirmation(true);
    }
  };

  const handleConfirmOrder = async () => {
    if (!deliveryDate) { // Modified to check only deliveryDate since location input is commented out
      setOrderMessage('Please fill in all fields');
      setTimeout(() => setOrderMessage(''), 3000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const customerData = JSON.parse(localStorage.getItem("customer"));
      const selectedItems = cartItems.filter(item => item.selected);

      const orderPayload = {
        customer_id: customerData.customer_id,
        delivery_date: deliveryDate,
        location: location || "Default Location", // Added fallback for location
        items: selectedItems.map(item => ({
          product_id: item.productId,
          quantity: item.quantity,
          total: item.price * item.quantity
        }))
      };

      const response = await fetch('http://localhost:5001/routes/orderRoutes/addFullOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        throw new Error('Order failed');
      }

      // Fixed: Use correct endpoint URL for removing cart items
      const removePromises = selectedItems.map(item =>
        fetch(`http://localhost:5001/routes/cartRoutes/delete/${item.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
      );

      await Promise.all(removePromises);

      setShowOrderConfirmation(false);
      setOrderMessage('Order placed successfully. Awaiting admin approval.');
      setCartItems(cartItems.filter(item => !item.selected));
      setTimeout(() => setOrderMessage(''), 3000);
    } catch (error) {
      console.error('Order error:', error);
      setOrderMessage('Failed to place order. Please try again.');
      setTimeout(() => setOrderMessage(''), 3000);
    }
  };

  const handleCloseOrderConfirmation = () => {
    setShowOrderConfirmation(false);
    setDeliveryDate('');
  };

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="cart-page">
      {showLoginPopup && (
        <div className="login-popup-overlay">
          <div className="login-popup">
            <h3>Login Required</h3>
            <p>You need to be logged in to proceed with the purchase.</p>
            <div className="popup-buttons">
              <button className="cancel-btn" onClick={handleCloseLoginPopup}>Cancel</button>
              <button className="login-btn" onClick={handleLoginRedirect}>Go to Login</button>
            </div>
          </div>
        </div>
      )}

      {showOrderConfirmation && (
        <div className="order-confirmation-overlay">
          <div className="order-confirmation-popup">
            <h3>Confirm Your Order</h3>
            <p>Please provide delivery details:</p>
            
            <div className="form-group">
              <label htmlFor="deliveryDate">Delivery Date:</label>
              <input
                type="date"
                id="deliveryDate"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            {/* <div className="form-group">
              <label htmlFor="location">Delivery Location:</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your delivery address"
                required
              />
            </div> */}
            
            <div className="order-summary">
              <h4>Order Summary</h4>
              {cartItems.filter(item => item.selected).map(item => (
                <div key={item.id} className="order-item">
                  <p><strong>Product:</strong> {item.name}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Price:</strong> Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
              <p className="order-total"><strong>Total:</strong> Rs. {total.toLocaleString()}</p>
            </div>
            
            <div className="popup-buttons">
              <button className="cancel-btn" onClick={handleCloseOrderConfirmation}>Cancel</button>
              <button className="confirm-btn" onClick={handleConfirmOrder}>Confirm Order</button>
            </div>
          </div>
        </div>
      )}

      <h1>Your Shopping Cart</h1>
      
      {orderMessage && (
        <div className={`order-message ${orderMessage.includes('success') ? 'success' : 'error'}`}>
          {orderMessage}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/customerproducts')} className="continue-shopping">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className={`cart-item ${item.selected ? 'selected' : ''}`}>
                <div className="item-select">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleItemSelection(item.id)}
                  />
                </div>
                <div className="item-image">
  <img 
    src={item.image} 
    alt={item.name}
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = '/path/to/placeholder-image.jpg';
    }}
  />
</div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <div className="item-price">Rs. {item.price?.toLocaleString() || '0'}</div>
                  <div className="item-quantity">
                    <label>Quantity:</label>
                    <input 
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                      min="1"
                    />
                  </div>
                  <button 
                    className="remove-item"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
                <div className="item-total">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Selected Items</span>
              <span>{cartItems.filter(item => item.selected).length}</span>
            </div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs. {total?.toLocaleString() || '0'}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>Rs. {total?.toLocaleString() || '0'}</span>
            </div>
            <button 
              onClick={handlePlaceOrder}
              className="checkout-btn"
              disabled={total === 0}
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;