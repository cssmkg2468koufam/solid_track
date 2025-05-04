import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Product_Details.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState('');
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

  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setShowLoginPopup(true);
    } else {
      navigate("/checkoutpage");
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    
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
          productId: product._id,
          quantity: quantity
        })
      });

      if (!response.ok) {
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
      
      <div className="breadcrumb">
        <span onClick={() => navigate('/')}>Home</span> &gt; 
        <span onClick={() => navigate(`/category/${product.category}`)}> {product.category}</span> &gt; 
        <span> {product.product_name}</span>
      </div>

      <div className="product-details-container">
        <div className="product-gallery">
          <div className="thumbnail-container">
            {productImages.map((img, index) => (
              <div 
                key={index} 
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="main-image">
            {productImages[selectedImage] ? (
              <img src={productImages[selectedImage]} alt={product.product_name} />
            ) : (
              <div className="placeholder-image">No Image Available</div>
            )}
          </div>
        </div>
        
        <div className="product-info">
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
          
          <div className="availability-section">
            <span className={`availability-status ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
            {product.quantity > 0 && (
              <span className="stock-quantity">Only {product.quantity} left</span>
            )}
          </div>
          
          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <div className="quantity-controls">
              <button 
                className="quantity-btn" 
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.quantity}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="quantity-input"
              />
              <button 
                className="quantity-btn" 
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.quantity}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="delivery-info">
            <div className="delivery-option">
              <i className="delivery-icon">🚚</i>
              <span>Free delivery on orders over Rs. 1000</span>
            </div>
            <div className="delivery-option">
              <i className="delivery-icon">⏱️</i>
              <span>Estimated delivery: 2-3 business days</span>
            </div>
          </div>
          
          <div className="product-actions">
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={product.quantity <= 0}
            >
              <i className="cart-icon">🛒</i> Add to Cart
            </button>
            <button 
              className={`buy-now-btn ${product.quantity <= 0 ? 'disabled' : ''}`} 
              onClick={handleBuyNow}
              disabled={product.quantity <= 0}
            >
              Buy Now
            </button>
          </div>
          
          {cartMessage && (
            <div className={`cart-message ${cartMessage.includes('success') ? 'success' : 'error'}`}>
              {cartMessage}
            </div>
          )}
          
          <div className="product-highlights">
            <h3>Highlights</h3>
            <ul>
              <li>Premium quality materials</li>
              <li>Manufacturer warranty included</li>
              <li>Easy returns within 15 days</li>
              {product.highlights && product.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="product-details-section">
        <div className="details-tabs">
          <button className="tab-active">Description</button>
          <button>Specifications</button>
          <button>Shipping Info</button>
        </div>
        
        <div className="tab-content">
          <div className="description-content">
            <h3>Product Description</h3>
            <p>{product.description || 'No detailed description available.'}</p>
          </div>
          
          <div className="specifications-content">
            <h3>Detailed Specifications</h3>
            <div className="specs-grid">
              <div className="spec-row">
                <span className="spec-name">Category</span>
                <span className="spec-value">{product.category || 'N/A'}</span>
              </div>
              {product.dimensions && (
                <div className="spec-row">
                  <span className="spec-name">Dimensions</span>
                  <span className="spec-value">{product.dimensions}</span>
                </div>
              )}
              {product.weight && (
                <div className="spec-row">
                  <span className="spec-name">Weight</span>
                  <span className="spec-value">{product.weight}</span>
                </div>
              )}
              {product.color && (
                <div className="spec-row">
                  <span className="spec-name">Color</span>
                  <span className="spec-value">{product.color}</span>
                </div>
              )}
              {product.material && (
                <div className="spec-row">
                  <span className="spec-name">Material</span>
                  <span className="spec-value">{product.material}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;