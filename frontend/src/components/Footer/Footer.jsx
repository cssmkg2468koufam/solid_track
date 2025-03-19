import React from 'react';
import './Footer.css'; // Import the CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>SOLIDTRACK</h3>
          <p>Your trusted partner in high-quality concrete products.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <nav className="footer-links">
            <a href="/">Home</a>
            <a href="/products">Products</a>
            <a href="#about-us">About Us</a> {/* Anchor link to About Us section */}
            <a href="#contact-us">Contact Us</a> {/* Anchor link to Contact Us section */}
          </nav>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SOLIDTRACK. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;