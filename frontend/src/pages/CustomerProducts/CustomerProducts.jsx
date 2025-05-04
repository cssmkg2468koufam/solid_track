import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CustomerProducts.css';

const CustomerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const filterOptions = ['All', 'Flower Pots', 'Lamppost', 'Concrete Ring', 'Waterlili', 'Interlock'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const endpoint = activeCategory === 'all' 
          ? 'http://localhost:5001/routes/productRoutes/get'
          : `http://localhost:5001/routes/productRoutes/type/${activeCategory}`;
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  const handleFilterChange = (category) => {
    setActiveCategory(category.toLowerCase());
  };

  if (loading) return <div className="products-page">Loading...</div>;
  if (error) return <div className="products-page">Error: {error}</div>;

  return (
    <div className="products-page">
      <div className="products-container">
        <div className="filter-sidebar">
          <h3>Filter Products</h3>
          <div className="filter-group">
            <h4>Category</h4>
            {filterOptions.map((option, index) => (
              <div className="filter-option" key={`category-${index}`}>
                <input
                  type="radio"
                  id={`category-${index}`}
                  name="category"
                  checked={activeCategory === option.toLowerCase()}
                  onChange={() => handleFilterChange(option.toLowerCase())}
                />
                <label htmlFor={`category-${index}`}>{option}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="products-grid">
          <h1>What are you looking for?</h1>
          <div className="grid">
            {products.map((product) => (
              <Link 
                to={`/product/${product.product_id}`} 
                className="product-card"
                key={product.product_id}
              >
                <div className="product-image">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.product_name} />
                  ) : (
                    <div className="placeholder-image">No Image</div>
                  )}
                </div>
                <div className="product-details">
                  <h3>{product.product_name}</h3>
                  <p>{product.description}</p>
                  <div className="product-price">Rs. {product.price_of_one_product}</div>
                  <div className="product-status">{product.status}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProducts;