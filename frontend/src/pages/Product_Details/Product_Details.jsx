import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Product_Details.css';
import flowerpots_1 from '../../assets/flowerpots_1.jpg';
import flowerpots_6 from '../../assets/flowerpots_6.jpg';
import flowerpots_7 from '../../assets/flowerpots_7.jpg';
import flowerpots_8 from '../../assets/flowerpots_8.jpg';
import lampposts from '../../assets/lampposts.jpg';
import waterlili from '../../assets/waterlili.jpg';
import pavers_2 from '../../assets/pavers_2.jpg';
import pavers_3 from '../../assets/pavers_3.jpg';
import pavers_4 from '../../assets/pavers_4.jpg';
import concrete_rings from '../../assets/concrete_rings.jpg';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample product data - same as in Products.jsx
  const productsData = [
    {
      id: 1,
      name: 'Flower Pots FP01',
      price: 1000,
      description: 'Versatile concrete mix suitable for general construction projects.',
      detailedDescription: 'Our FP01 flower pots are crafted with high-quality concrete that ensures durability and aesthetic appeal. Perfect for gardens, patios, and indoor spaces. These versatile pots can accommodate various plant types and sizes.',
      image: flowerpots_1,
      type: 'Flower Pot',
      color: 'Grey',
      condition: 'New',
      dimensions: '30cm x 30cm x 35cm',
      weight: '5kg'
    },
    {
      id: 2,
      name: 'Flower Pots FP02',
      price: 1800,
      description: 'Superior strength concrete for load-bearing structures.',
      detailedDescription: 'The FP02 series features enhanced concrete mixture that provides superior strength. These pots are ideal for larger plants and can withstand harsh weather conditions without cracking or fading.',
      image: flowerpots_6,
      type: 'Flower Pot',
      color: 'Beige',
      condition: 'New',
      dimensions: '40cm x 40cm x 45cm',
      weight: '7kg'
    },
    {
      id: 3,
      name: 'Flower Pots FP03',
      price: 1600,
      description: 'Specialized mix for decorative elements and finishing.',
      detailedDescription: 'Our decorative FP03 flower pots are designed with aesthetics in mind. The specialized concrete mix allows for intricate patterns and smooth finishing, making them perfect centerpieces for any space.',
      image: flowerpots_7,
      type: 'Flower Pot',
      color: 'Brown',
      condition: 'New',
      dimensions: '35cm x 35cm x 40cm',
      weight: '6kg'
    },
    {
      id: 4,
      name: 'Flower Pots FP04',
      price: 2400,
      description: 'Rapid-setting formula for time-sensitive construction needs.',
      detailedDescription: 'The FP04 series is manufactured using a rapid-setting concrete formula. These pots maintain the same quality and durability as our other products while offering a unique design that complements modern spaces.',
      image: flowerpots_8,
      type: 'Flower Pot',
      color: 'Grey',
      condition: 'New',
      dimensions: '45cm x 45cm x 50cm',
      weight: '8kg'
    },
    {
      id: 5,
      name: 'Lamppost L01',
      price: 5000,
      description: 'Enhanced durability with integrated fiber reinforcement.',
      detailedDescription: 'The L01 lamppost features integrated fiber reinforcement for enhanced durability. Perfect for gardens, driveways, and pathways, this lamppost provides both functionality and aesthetic appeal with its elegant design.',
      image: lampposts,
      type: 'Lamppost',
      color: 'Grey',
      condition: 'New',
      dimensions: '30cm x 30cm x 150cm',
      weight: '25kg'
    },
    {
      id: 6,
      name: 'Lamppost L02',
      price: 5000,
      description: 'Water-resistant formula for foundations and water features.',
      detailedDescription: 'Our L02 lamppost is crafted with a special water-resistant formula, making it ideal for areas near water features or regions with high rainfall. The elegant design adds a touch of sophistication to any outdoor space.',
      image: lampposts,
      type: 'Lamppost',
      color: 'White',
      condition: 'New',
      dimensions: '35cm x 35cm x 160cm',
      weight: '28kg'
    },
    {
      id: 7,
      name: 'Waterlili W01',
      price: 2800,
      description: 'Water-resistant formula for foundations and water features.',
      detailedDescription: 'The W01 Waterlili is designed specifically for water gardens and features. Made with water-resistant concrete, it provides a natural-looking habitat for aquatic plants and adds charm to any water feature.',
      image: waterlili,
      type: 'Waterlili',
      color: 'Natural',
      condition: 'New',
      dimensions: '60cm x 60cm x 25cm',
      weight: '15kg'
    },
    {
      id: 8,
      name: 'Waterlili W02',
      price: 2800,
      description: 'Water-resistant formula for foundations and water features.',
      detailedDescription: 'Our W02 Waterlili offers an elegant design with the same water-resistant properties as the W01. Perfect for ponds, fountains, and other water features, it provides a stable platform for aquatic plants.',
      image: waterlili,
      type: 'Waterlili',
      color: 'Natural',
      condition: 'New',
      dimensions: '65cm x 65cm x 30cm',
      weight: '18kg'
    },
    {
      id: 9,
      name: 'Interlock IL01',
      price: 2800,
      description: 'Water-resistant formula for foundations and water features.',
      detailedDescription: 'The IL01 interlock pavers are perfect for driveways, walkways, and patios. Their interlocking design ensures stability while the durable concrete composition guarantees longevity even under heavy traffic.',
      image: pavers_2,
      type: 'Interlock Paver',
      color: 'Grey',
      condition: 'New',
      dimensions: '20cm x 10cm x 6cm',
      weight: '2kg per piece'
    },
    {
      id: 10,
      name: 'Interlock IL02',
      price: 2800,
      description: 'Water-resistant formula for foundations and water features.',
      detailedDescription: 'Our IL02 interlocking pavers come in a vibrant red color that adds warmth to any outdoor space. Their durable construction and precise dimensions make installation easy and ensure a long-lasting result.',
      image: pavers_3,
      type: 'Interlock Paver',
      color: 'Red',
      condition: 'New',
      dimensions: '20cm x 10cm x 6cm',
      weight: '2kg per piece'
    },
    {
      id: 11,
      name: 'Interlock IL03',
      price: 2800,
      description: 'Water-resistant formula for foundations and water features.',
      detailedDescription: 'The IL03 multi-colored interlock pavers offer a unique aesthetic that can complement various landscape designs. Their durable construction ensures they maintain their color and integrity for years to come.',
      image: pavers_4,
      type: 'Interlock Paver',
      color: 'Multi',
      condition: 'New',
      dimensions: '20cm x 10cm x 6cm',
      weight: '2kg per piece'
    },
    {
      id: 12,
      name: 'Concrete Ring',
      price: 2800,
      description: 'Water-resistant formula for foundations and water features.',
      detailedDescription: 'Our concrete rings are versatile elements that can be used for various landscaping projects, including tree surrounds, well covers, and decorative elements. Made with water-resistant concrete, they maintain their structural integrity in all weather conditions.',
      image: concrete_rings,
      type: 'Concrete Ring',
      color: 'Grey',
      condition: 'New',
      dimensions: '80cm diameter x 20cm height',
      weight: '30kg'
    },
  ];

  useEffect(() => {
    // Simulate fetching product data
    const fetchProduct = () => {
      setLoading(true);
      setTimeout(() => {
        const foundProduct = productsData.find(p => p.id === parseInt(id));
        setProduct(foundProduct);
        setLoading(false);
      }, 300); // Simulate network delay
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (!product) {
    return <div className="error">Product not found.</div>;
  }

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <div className="product-details-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-details-info">
          <h1>{product.name}</h1>
          <div className="product-price">Rs. {product.price}</div>
          <div className="product-description">
            <p>{product.detailedDescription}</p>
          </div>
          <div className="product-specs">
            <h3>Specifications</h3>
            <ul>
              <li><span>Type:</span> {product.type}</li>
              <li><span>Color:</span> {product.color}</li>
              <li><span>Condition:</span> {product.condition}</li>
              <li><span>Dimensions:</span> {product.dimensions}</li>
              <li><span>Weight:</span> {product.weight}</li>
            </ul>
          </div>
          <div className="product-actions">
            <button className="add-to-cart-btn">Add to Cart</button>
            <Link to="/products" className="back-btn">Back to Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;