import React from 'react'
import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar/NavBar';
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import CustomerProducts from './pages/CustomerProducts/CustomerProducts'
import Login from './pages/Login/Login'
import ProductDetails from './pages/Product_Details/Product_Details';
import Register from './pages/Register/Register'
import Footer from './components/Footer/Footer'
import Profile from './pages/Profile/Profiile'
import Dashboard from './admin/pages/Dashboard' // Import the Admin App component
import Materials from './admin/pages/Materials'
import Details from './admin/pages/Details'
import Customer from './admin/pages/Customer'
import Orders from './admin/pages/Orders'
import Products from './admin/pages/Products'
import Supplier from './admin/pages/Supplier'
import AdminProfile from './admin/pages/AdminProfile' // Import the Admin Profile component


const App = () => {
  return (
    <div className='App'>
        {/* Conditionally render NavBar to hide it on pages that I need */}
        <Routes>
          <Route path='/login' element={null} />
          <Route path='/register' element={null} />
          <Route path='/dashboard-admin' element={null} /> {/* Admin App component */}
          <Route path='/materials-admin' element={null} /> {/* Admin App component */}
          <Route path='/details-admin' element={null} /> {/* Admin App component */}
          <Route path='/products-admin' element={null} /> {/* Admin App component */}
          <Route path='/customers-admin' element={null} /> {/* Admin App component */}
          <Route path='/orders-admin' element={null} /> {/* Admin App component */}
          <Route path='/supplier-admin' element={null} /> {/* Admin App component */}
          <Route path='/adminprofile-admin' element={null} /> {/* Admin Profile component */}
          <Route path='*' element={<NavBar />} /> 
        </Routes>
        
        <div>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/order' element={<PlaceOrder/>}/>
            <Route path="/customerproducts" element={<CustomerProducts />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/dashboard-admin' element={<Dashboard />} /> {/* Admin App component */}
            <Route path='/materials-admin' element={<Materials />} /> {/* Admin App component */}
            <Route path='/details-admin' element={<Details />} /> {/* Admin App component */}
            <Route path='/products-admin' element={<Products />} /> {/* Admin App component */}
            <Route path='/customers-admin' element={<Customer />} /> {/* Admin App component */}
            <Route path='/orders-admin' element={<Orders />} /> {/* Admin App component */}
            <Route path='/supplier-admin' element={<Supplier />} /> {/* Admin App component */}
            <Route path='/adminprofile-admin' element={<AdminProfile />} /> {/* Admin Profile component */}

          </Routes>
          
          {/* Conditionally render Footer to hide it on pages that I need */}
          <Routes>
            <Route path='/login' element={null} />
            <Route path='/register' element={null} />
            <Route path="dashboard-admin" element={<null />} />
            <Route path="/materials-admin" element={<null />} />
            <Route path="/details-admin" element={<null />} />
            <Route path="/products-admin" element={<null/>} />
            <Route path="/customers-admin" element={<null />} />
            <Route path="/orders-admin" element={<null />} />
            <Route path="/supplier-admin" element={<null />} />
            <Route path="/adminprofile-admin" element={<null />} />
            <Route path='*' element={<Footer />} />
          </Routes>
        </div>
    </div>
  );
};

export default App;


