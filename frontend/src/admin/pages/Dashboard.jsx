import React from 'react';
import './AppAdmin.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';


import 
{BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill}
 from 'react-icons/bs'

const Dashboard = () => {

  return (
   
      <div className="grid-container">
        <Header />
        <Sidebar />
    <main className='main-container'>
      <div className='main-title'>
        <h3>DASHBOARD</h3>
      </div>
      <div className='main-cards'>
        <div className="card">
        <div className='card-inner'>
          <h3>PRODUCTS</h3>
          <BsFillArchiveFill className='card_icon'/>
        </div>
        <h1></h1>
        </div>
        <div className="card">
        <div className='card-inner'>
          <h3>CATEGORIES</h3>
          <BsFillGrid3X3GapFill className='card_icon'/>
        </div>
        <h1></h1>
        </div>
        <div className="card">
        <div className='card-inner'>
          <h3>CUSTOMERS</h3>
          <BsPeopleFill className='card_icon'/>
        </div>
        <h1></h1>
        </div>
        <div className="card">
        <div className='card-inner'>
          <h3>ALERTS</h3>
          <BsFillBellFill className='card_icon'/>
        </div>
        <h1></h1>
        </div>
      </div>

    
    </main>
      </div>
    
  );
};

export default Dashboard;
