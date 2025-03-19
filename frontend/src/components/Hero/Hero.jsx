import React from 'react'
import './Hero.css'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='hero'>
        <div className="hero-contents">
            <h2>Order your product here</h2>
            <p>Discover a wide range of durable and stylish concrete products, crafted to enhance your space with strength and elegance</p>
            <Link to="/products"><button>View Products</button></Link>
        </div>
    </div>
  )
}

export default Hero