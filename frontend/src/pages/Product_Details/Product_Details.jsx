import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Product_Details.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5001/routes/productRoutes/get/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data) {
          throw new Error('Product not found');
        }

        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleOrderNow = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setShowLoginPopup(true);
    } else {
      setShowOrderConfirmation(true);
    }
  };

  const handleConfirmOrder = async () => {
    if (!deliveryDate || !location) {
      alert('Please fill in all fields');
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const customerData = JSON.parse(localStorage.getItem("customer"));
      const customer_id = customerData?.customer_id;

      const response = await fetch('http://localhost:5001/routes/orderRoutes/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: product.product_id,
          quantity: quantity,
          total: product.price_of_one_product * quantity,
          customer_id: customerData.customer_id,
          delivery_date: deliveryDate,
          location: location
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      setShowOrderConfirmation(false);
  
      alert("Order placed successfully. Awaiting admin approval.");
    } catch (error) {
      console.error('Order error:', error);
      alert("Failed to place order. Please try again later.");
    }
  };

  const handleCloseOrderConfirmation = () => {
    setShowOrderConfirmation(false);
    setDeliveryDate('');
    setLocation('');
  };
 

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    const customerData = JSON.parse(localStorage.getItem("customer"));
  const customer_id = customerData?.customer_id;

  
    
    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/routes/cartRoutes/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customer_id: customer_id,
          product_id: product.product_id,
          quantity: quantity,
          total: product.price_of_one_product * quantity
        })
      });

      if (!response.ok) {
        if (response.status === 409) {
          setCartMessage('Item already in cart!');
          return;
        }
        throw new Error('Failed to add to cart');
      }

      setCartMessage('Item added to cart successfully!');
      setTimeout(() => setCartMessage(''), 3000);
    } catch (err) {
      setCartMessage('Error adding to cart. Please try again.');
      console.error('Error adding to cart:', err);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (product.quantity && newQuantity > product.quantity) return;
    setQuantity(newQuantity);
  };

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">!</div>
        <h2>Error Loading Product</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found-container">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or may have been removed.</p>
        <button onClick={() => navigate(-1)} className="back-btn">
          Go Back
        </button>
      </div>
    );
  }

  const productImages = [
    product.image_url,
    "https://via.placeholder.com/500x500?text=Product+Angle+2",
    "https://via.placeholder.com/500x500?text=Product+Closeup",
    "https://via.placeholder.com/500x500?text=Product+In+Use"
  ];

  return (
    <div className="product-details-page">
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

      {/* order confirmation popup */}
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
                min={new Date().toISOString().split('T')[0]} // Prevent past dates
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Delivery Location:</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your delivery address"
                required
              />
            </div>
            
            <div className="order-summary">
              <h4>Order Summary</h4>
              <p><strong>Product:</strong> {product.product_name}</p>
              <p><strong>Quantity:</strong> {quantity}</p>
              <p><strong>Total:</strong> Rs. {(product.price_of_one_product * quantity).toLocaleString()}</p>
            </div>
            
            <div className="popup-buttons">
              <button className="cancel-btn" onClick={handleCloseOrderConfirmation}>Cancel</button>
              <button className="confirm-btn" onClick={handleConfirmOrder}>Confirm Order</button>
            </div>
          </div>
        </div>
      )}

      
      <div className="breadcrumb">
        <span onClick={() => navigate('/')}>Home</span> &gt; 
        <span onClick={() => navigate(`/category/${product.category}`)}> {product.category}</span> &gt; 
        <span> {product.product_name}</span>
      </div>

      <div className="product-details-container">
        <div className="product-gallery">
          <div className="main-image">
            {productImages[selectedImage] ? (
              <img src={productImages[selectedImage]} alt={product.product_name} />
            ) : (
              <div className="placeholder-image">No Image Available</div>
            )}
          </div>
        </div>
        
        <div className="customer-product-info">
          <h1 className="product-title">{product.product_name}</h1>
          
          <div className="price-section">
            <span className="current-price">Rs. {product.price_of_one_product.toLocaleString()}</span>
            {product.original_price && (
              <span className="original-price">Rs. {product.original_price.toLocaleString()}</span>
            )}
            {product.discount && (
              <span className="discount-badge">{product.discount}% OFF</span>
            )}
          </div>
          

          <div className="product-details-section">
        <div className="details-tabs">
          <button className="tab-active">Description</button>

        </div>
        
        <div className="tab-content">
          <div className="description-content">
            <h3>Product Description</h3>
            <p>{product.description || 'No detailed description available.'}</p>
          </div>
        </div>
      </div>

          <div className="product-actions">
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={product.quantity <= 0}
            > Add to Cart
            </button>
            <button 
              className={`buy-now-btn ${product.quantity <= 0 ? 'disabled' : ''}`} 
              onClick={handleOrderNow}
              disabled={product.quantity <= 0}
            >
              Place Order
            </button>
          </div>
          
          {cartMessage && (
            <div className={`cart-message ${cartMessage.includes('success') ? 'success' : 'error'}`}>
              {cartMessage}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;