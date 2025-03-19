import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Products.css';
import flowerpots_1 from '../../assets/flowerpots_1.jpg'
import flowerpots_6 from '../../assets/flowerpots_6.jpg'
import flowerpots_7 from '../../assets/flowerpots_7.jpg'
import flowerpots_8 from '../../assets/flowerpots_8.jpg'
import lampposts from '../../assets/lampposts.jpg'
import waterlili from '../../assets/waterlili.jpg'
import pavers_2 from '../../assets/pavers_2.jpg'
import pavers_3 from '../../assets/pavers_3.jpg'
import pavers_4 from '../../assets/pavers_4.jpg'
import concrete_rings from '../../assets/concrete_rings.jpg'


const Products = () => {
  // Sample concrete products data with additional details
  const initialProducts = [
    {
      id: 1,
      name: 'Flower Pots FP01',
      price: 1000,
      description: 'Versatile concrete mix suitable for general construction projects.',
      image: flowerpots_1,
      type: 'Flower Pot',
      color: 'Grey',
      condition: 'New',
    },
    {
      id: 2,
      name: 'Flower Pots FP02',
      price: 1800,
      description: 'Superior strength concrete for load-bearing structures.',
      image: flowerpots_6,
      type: 'Flower Pot',
      color: 'Beige',
      condition: 'New',
    },
    {
      id: 3,
      name: 'Flower Pots FP03',
      price: 1600,
      description: 'Specialized mix for decorative elements and finishing.',
      image: flowerpots_7,
      type: 'Flower Pot',
      color: 'Brown',
      condition: 'New',
    },
    {
      id: 4,
      name: 'Flower Pots FP04',
      price: 2400,
      description: 'Rapid-setting formula for time-sensitive construction needs.',
      image: flowerpots_8,
      type: 'Flower Pot',
      color: 'Grey',
      condition: 'New',
    },
    {
      id: 5,
      name: 'Lamppost L01',
      price: 5000,
      description: 'Enhanced durability with integrated fiber reinforcement.',
      image: lampposts,
      type: 'Lamppost',
      color: 'Grey',
      condition: 'New',
    },
    {
      id: 6,
      name: 'Lamppost L02',
      price: 5000,
      description: 'Water-resistant formula for foundations and water features.',
      image: lampposts,
      type: 'Lamppost',
      color: 'White',
      condition: 'New',
    },
    {
      id: 7,
      name: 'Waterlili W01',
      price: 3000,
      description: 'Water-resistant formula for foundations and water features.',
      image: waterlili,
      type: 'Waterlili',
      color: 'Natural',
      condition: 'New',
    },
    {
      id: 8,
      name: 'Waterlili W02',
      price: 2800,
      description: 'Water-resistant formula for foundations and water features.',
      image: waterlili,
      type: 'Waterlili',
      color: 'Natural',
      condition: 'New',
    },
    {
      id: 9,
      name: 'Interlock IL01',
      price: 280,
      description: 'Water-resistant formula for foundations and water features.',
      image: pavers_2,
      type: 'Interlock Paver',
      color: 'Grey',
      condition: 'New',
    },
    {
      id: 10,
      name: 'Interlock IL02',
      price: 280,
      description: 'Water-resistant formula for foundations and water features.',
      image: pavers_3,
      type: 'Interlock Paver',
      color: 'Red',
      condition: 'New',
    },
    {
      id: 11,
      name: 'Interlock IL03',
      price: 280,
      description: 'Water-resistant formula for foundations and water features.',
      image: pavers_4,
      type: 'Interlock Paver',
      color: 'Multi',
      condition: 'New',
    },
    {
      id: 12,
      name: 'Concrete Ring',
      price: 4000,
      description: 'Water-resistant formula for foundations and water features.',
      image: concrete_rings,
      type: 'Concrete Ring',
      color: 'Grey',
      condition: 'New',
    },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter options
  const filterOptions = ['All', 'Flower Pots', 'Lamppost', 'Concrete Ring', 'Waterlili', 'Interlock'];

  // Handle filter changes
  const handleFilterChange = (category) => {
    setActiveCategory(category);

    // Apply filters
    let filteredProducts = initialProducts;
    if (category !== 'all') {
      filteredProducts = initialProducts.filter((product) =>
        product.name.toLowerCase().includes(category.toLowerCase())
      );
    }

    setProducts(filteredProducts);
  };

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

export default Products;