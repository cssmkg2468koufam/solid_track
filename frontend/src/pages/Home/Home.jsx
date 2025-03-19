import React from 'react';
import './Home.css';
import Hero from '../../components/Hero/Hero';
import Categories from '../../components/Categories/Categories';
import AboutUs from '../../components/AboutUs/AboutUs';
import ContactUs from '../../components/ContactUs/ContactUs';
import ExploreProducts from '../../components/ExploreProducts/ExploreProducts';


const Home = () => {
  return (
    <div className="home" id='home'>
      <Hero />
      <Categories />
      <ExploreProducts />
      <AboutUs id="about-us" />
      {/* <ContactUs id="contact-us" /> */}
    </div>
  );
};

export default Home;