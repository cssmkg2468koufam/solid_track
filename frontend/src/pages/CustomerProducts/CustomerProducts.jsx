import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CustomerProducts.css';
// import flowerpots_1 from '../../assets/flowerpots_1.jpg'
// import flowerpots_6 from '../../assets/flowerpots_6.jpg'
// import flowerpots_7 from '../../assets/flowerpots_7.jpg'
// import flowerpots_8 from '../../assets/flowerpots_8.jpg'
// import lampposts from '../../assets/lampposts.jpg'
// import waterlili from '../../assets/waterlili.jpg'
// import pavers_2 from '../../assets/pavers_2.jpg'
// import pavers_3 from '../../assets/pavers_3.jpg'
// import pavers_4 from '../../assets/pavers_4.jpg'
// import concrete_rings from '../../assets/concrete_rings.jpg'


const CustomerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter options
  const filterOptions = ['All', 'Flower Pots', 'Lamppost', 'Concrete Ring', 'Waterlili', 'Interlock'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/routes/customerproductsRoutes/get', {
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
  }, []);

    // Handle filter changes
    const handleFilterChange = (category) => {
      setActiveCategory(category.toLowerCase());
  
      // If "All" is selected, we don't need to filter
      if (category.toLowerCase() === 'all') {
        fetchProducts();
        return;
      }
  
      // Otherwise, fetch products by type
      const fetchProductsByType = async () => {
        try {
          const response = await fetch(`http://localhost:5000/routes/customerproductsRoutes/type/${category}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${category} products`);
          }
          const data = await response.json();
          setProducts(data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchProductsByType();
  };

  if (loading) return <div className="products-page">Loading...</div>;
  if (error) return <div className="products-page">Error: {error}</div>;


  return (
    <div className="products-page">
      <div className="products-container">
        {/* Filter Sidebar */}
        <div className="filter-sidebar">
          <h3>Filter Products</h3>

          {/* Category Filter */}
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

        {/* Products Grid */}
        <div className="products-grid">
          <h1>What are you looking for?</h1>
          <div className="grid">
            {products.map((product) => (
              <Link 
                to={`/product/${product.id}`} 
                className="product-card"
                key={product.id}
              >
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-price">Rs. {product.price}</div>
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