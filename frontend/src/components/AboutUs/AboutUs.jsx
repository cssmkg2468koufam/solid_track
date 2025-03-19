import React from 'react';
import './AboutUs.css';
import place_img1 from '../../assets/place_img1.jpg'; // Replace with your image path

const AboutUs = () => {
  return (
    <section id="about-us" className="about-us-section">
      <div className="about-us-container">
        <div className="about-us-image">
          <img src={place_img1} alt="About Us" />
        </div>
        <div className="about-us-content">
          <h2>About Us</h2>
          <p>
            At <strong>SOLIDTRACK</strong>, we are dedicated to providing high-quality concrete products that meet the needs of modern construction. With years of experience in the industry, we pride ourselves on delivering durable, reliable, and innovative solutions for both residential and commercial projects.
          </p>
          <p>
            Our team of experts is committed to excellence, ensuring that every product we offer meets the highest standards of quality and safety. Whether you're building a new home, renovating an existing structure, or working on a large-scale commercial project, we have the right concrete solutions for you.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;