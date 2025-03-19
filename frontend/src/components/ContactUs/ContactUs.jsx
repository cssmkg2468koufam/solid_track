import React from 'react';
import './ContactUs.css';
import contact_banner from '../../assets/contact_banner.jpg'; // Replace with your image path

const ContactUs = () => {
  return (
    <section id="contact-us" className="contact-us-section">
      <div className="contact-us-container">
        <div className="contact-us-image">
          <img src={contact_banner} alt="Contact Us" />
        </div>
        <div className="contact-us-content">
          <h2>Contact Us</h2>
          <p>
            Have questions or need assistance? We're here to help! Reach out to us for any inquiries about our products, services, or projects. Our team is ready to provide you with the support you need.
          </p>
          <form className="contact-form">
            <div className="form-group">
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <textarea placeholder="Your Message" rows="5" required></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;