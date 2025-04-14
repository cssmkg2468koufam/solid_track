import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Materials from './pages/Materials';
import Details from './pages/Details';
import Products from './pages/Products';
import Customer from './pages/Customer';


function App() {
  return (
    <Router>
      <div className="grid-container">
        <Header />
        <Sidebar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/details" element={<Details />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customer />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;