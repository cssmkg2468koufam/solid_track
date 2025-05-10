import React from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";


const CheckoutPage = () => {
    const location = useLocation();
    const cartItems = location.state?.cartItems || []; // Get cart items from location state
    const total = location.state?.total || 0; // Get total from location state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
       
    }, [cartItems, navigate]);
    
    return (
        <div className="checkout-page">
       
        <div className="checkout-container">
            <h1>Checkout</h1>
            {loading ? (
            <p>Loading...</p>
            ) : (
            <div className="checkout-details">
                <h2>Your Cart Items</h2>
                {cartItems.map((item) => (
                <div key={item.id} className="checkout-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>Price: ${item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    </div>
                </div>
                ))}
                <h2>Total: ${total}</h2>
            </div>
            )}
        </div>
        </div>
    );
    }
export default CheckoutPage;