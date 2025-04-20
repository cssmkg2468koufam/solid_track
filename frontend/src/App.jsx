import React from 'react'
import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar/NavBar';
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Products from './pages/Products/Products'
import Login from './pages/Login/Login'
import ProductDetails from './pages/Product_Details/Product_Details';
import Register from './pages/Register/Register'
import Footer from './components/Footer/Footer'
import Profile from './pages/Profile/Profiile'


const App = () => {
  return (
    <div className='App'>
        {/* Conditionally render NavBar to hide it on login/register pages */}
        <Routes>
          <Route path='/login' element={null} />
          <Route path='/register' element={null} />
          <Route path='*' element={<NavBar />} /> 
        </Routes>
        
        <div>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/order' element={<PlaceOrder/>}/>
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/profile' element={<Profile/>}/>

          </Routes>
          
          {/* Conditionally render Footer to hide it on login/register pages */}
          <Routes>
            <Route path='/login' element={null} />
            <Route path='/register' element={null} />
            <Route path='*' element={<Footer />} />
          </Routes>
        </div>
    </div>
  );
};

export default App;


