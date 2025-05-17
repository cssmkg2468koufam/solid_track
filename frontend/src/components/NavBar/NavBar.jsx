import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";
import logo from "../../assets/logo.png";
import basket_icon from "../../assets/basket_icon.png";
import profile_icon from "../../assets/profile_icon.png";

const NavBar = () => {  
  const navigate = useNavigate();
  const customer = JSON.parse(localStorage.getItem("customer"));
  const admin = JSON.parse(localStorage.getItem("admin"));
  const user = customer;

  const handleScrollToSection = (sectionId) => {
    navigate("/"); // Navigate to the home page first
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // Small delay to ensure the page is loaded
  };

  const handleLogout = () => {
    localStorage.removeItem("customer");
    localStorage.removeItem("admin");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/"; // Refresh to update NavBar
  };

  const handleCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate("/cart");
    }
  }

  return (
    <div className="navbar">
      <img src={logo} alt="Logo" />
      <ul className="navbar-container">
        <li>
          <button 
            style={{backgroundColor:"white"}} 
            onClick={() => handleScrollToSection("home")} 
            className="nav-link"
          >
            Home
          </button>
        </li>
        <li>
          <Link to="/customerproducts" className="nav-link">
            Products
          </Link>
        </li>
        <li>
          <button 
            style={{backgroundColor:"white"}} 
            onClick={() => handleScrollToSection("about-us")} 
            className="nav-link"
          >
            About Us
          </button>
        </li>
      </ul>
      <div className="navbar-right" id="navbar-right">
        {user && (
          <button 
            className="my-orders-button"
            onClick={() => navigate("/customerorders")}
          >
            My Orders
          </button>
        )}
        <div className="navbar-cart-icon">
          <img src={basket_icon} alt="Cart" onClick={handleCart}/>
          <div className="dot"></div>
        </div>
        <nav>
          {user ? (
            <div className="profile-icon-container">
              <img 
                src={profile_icon} 
                alt="Profile" 
                className="profile-icon"
                onClick={() => navigate("/profile")}
              />
              <button 
                onClick={handleLogout}
                className="logout-button"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button>Sign In</button>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};

export default NavBar;