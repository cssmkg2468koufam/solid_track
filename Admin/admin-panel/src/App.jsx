import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Materials from './pages/Materials'

function App() {
  return (
    <Router>
      <div className="grid-container">
        <Header />
        <Sidebar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Materials" element={<Materials />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App