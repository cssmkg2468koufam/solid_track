import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search_icon.png";
import basket_icon from "../../assets/basket_icon.png";

const NavBar = () => {
  const navigate = useNavigate();

  const handleScrollToSection = (sectionId) => {
    navigate("/"); // Navigate to the home page first
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // Small delay to ensure the page is loaded
  };

  return (
    <div className="navbar">
      <img src={logo} alt="Logo" />
      <ul className="navbar-container">
        <li>
        <button style={{backgroundColor:"white"}} onClick={() => handleScrollToSection("home")} className="nav-link">
            Home
          </button>
        </li>
        <li>
          <Link to="/products" className="nav-link">
            Products
          </Link>
        </li>
        {/* <li>
          <button style={{backgroundColor:"white"}} onClick={() => handleScrollToSection("contact-us")} className="nav-link">
            Contact Us
          </button>
        </li> */}
        <li>
          <button style={{backgroundColor:"white"}} onClick={() => handleScrollToSection("about-us")} className="nav-link">
            About Us
          </button>
        </li>
      </ul>
      <div className="navbar-right" id="navbar-right">
        <img src={search_icon} alt="" />
        <div className="navbar-search-icon">
          <img src={basket_icon} alt="" />
          <div className="dot"></div>
        </div>
        <nav>
          <Link to="/login">
            <button>Sign In</button>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
