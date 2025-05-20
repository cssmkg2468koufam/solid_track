import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ExploreProducts.css';
import flowerpots_9 from '../../assets/flowerpots_9.webp';
import flowerpots_4 from '../../assets/flowerpots_4.jpg';
import lampposts from '../../assets/lampposts.jpg';
import interlock_pavers_2 from '../../assets/interlock_pavers_2.webp';
import waterlili from '../../assets/waterlili.jpg';
import flowerpots_5 from '../../assets/flowerpots_5.jpg';

const products = [
    { id: 1, name: "Flower Pots", image: flowerpots_9, category: "flower-pots" },
    { id: 2, name: "Flower Pots", image: flowerpots_4, category: "flower-pots" },
    { id: 3, name: "Flower Pots", image: flowerpots_5, category: "flower-pots" },
    { id: 4, name: "Lampposts", image: lampposts, category: "lampposts" },
    { id: 5, name: "Pavers", image: interlock_pavers_2, category: "pavers" },
    { id: 6, name: "Waterlilies", image: waterlili, category: "waterlilies" }
];

const ExploreProducts = () => {

    return (
        <section className="ep-section">
            <div className="ep-header">
                <h1 className="ep-title">Explore Our Products</h1>
                <p className="ep-subtitle">
                    Discover our high-quality concrete products, crafted with durability and aesthetics in mind.
                </p>
            </div>

            <div className="ep-container">
                <div className="ep-products-grid">
                    {products.map(product => (
                        <div 
                            key={product.id} 
                            className="ep-product-card"
                        >
                            <div className="ep-image-wrapper">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="ep-product-image"
                                />
                            </div>
                            <h3 className="ep-product-name">{product.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExploreProducts;