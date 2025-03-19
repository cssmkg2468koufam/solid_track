import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ExploreProducts.css';
import flowerpots_1 from '../../assets/flowerpots_1.jpg';
import flowerpots_4 from '../../assets/flowerpots_4.jpg';
import lampposts from '../../assets/lampposts.jpg';
import pavers_1 from '../../assets/pavers_1.jpg';
import waterlili from '../../assets/waterlili.jpg';
import flowerpots_5 from '../../assets/flowerpots_5.jpg';

const products = [
    { id: 1, name: "Flower Pots", image: flowerpots_1, category: "flower-pots" },
    { id: 2, name: "Flower Pots", image: flowerpots_4, category: "flower-pots" },
    { id: 3, name: "Flower Pots", image: flowerpots_5, category: "flower-pots" },
    { id: 4, name: "Lampposts", image: lampposts, category: "lampposts" },
    { id: 5, name: "Pavers", image: pavers_1, category: "pavers" },
    { id: 6, name: "Waterlilies", image: waterlili, category: "waterlilies" }
];

const ExploreProducts = () => {
    const navigate = useNavigate();

    const handleClick = (category) => {
        navigate(`/category/${category}`);
    };

    return (
        <div className='explore-products' id='explore-products'>
            <h1>Explore Our Products</h1>
            <p className='explore-products-text'>
                Discover our high-quality concrete products, crafted with durability and aesthetics in mind.
            </p>
            <div className="explore-products-container">
                <div className="explore-products-list">
                    {products.map(product => (
                        <div 
                            key={product.id} 
                            className="product-card" 
                            onClick={() => handleClick(product.category)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src={product.image} alt={product.name} className="product-image" />
                            <p className="product-name">{product.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExploreProducts;
