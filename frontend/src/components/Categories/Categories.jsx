import React from 'react'
import './Categories.css'
import customized_products from '../../assets/customized_products.webp'
import pre_build_products from '../../assets/pre_build_products.jpg'

const Categories = () => {
  return (
    <div className="categories">
      <div className="category">
        <div className="category-image">
          <img src={pre_build_products} alt="pre_build_products" />
        </div>
        <div className="category-description">
          <h2>Pre-build Products</h2>
          <p>Our pre-build concrete products are designed for quick and easy installation, making them perfect for projects that need to be completed efficiently. Made from high-quality materials, these durable and long-lasting products are ideal for both residential and commercial use. With a wide range of options, including slabs, blocks, and decorative pieces, you can find the perfect solution for your needs without compromising on quality or affordability</p>
        </div>
      </div>
      <div className="category reverse">
        <div className="category-image">
          <img src={customized_products} alt="Customized Products" />
        </div>
        <div className="category-description">
          <h2>Customized Products</h2>
          <p>Customize your concrete products to fit your unique vision and requirements. Whether you need a specific size, shape, or design, our team will work with you to create a product that perfectly matches your needs. From modern finishes to intricate patterns, our customized solutions are crafted with precision and attention to detail, ensuring a perfect fit for your project</p>
        </div>
      </div>
    </div>
  );
};

export default Categories;