import React from 'react'
import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar/NavBar';
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import CustomerProducts from './pages/CustomerProducts/CustomerProducts'
import Login from './pages/Login/Login'
import ProductDetails from './pages/Product_Details/Product_Details';
import Register from './pages/Register/Register'
import Footer from './components/Footer/Footer'
import Profile from './pages/Profile/Profiile'
import Dashboard from './admin/pages/Dashboard' 
import Materials from './admin/pages/Materials'
import Details from './admin/pages/Details'
import Customer from './admin/pages/Customer'
import Orders from './admin/pages/Orders'
import Products from './admin/pages/Products'
import Supplier from './admin/pages/Supplier'
import AdminProfile from './admin/pages/AdminProfile' 
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import CheckoutPageAdvance from './pages/CheckoutPage/CheckoutPageAdvance';
import CustomerOrder from './pages/CustomerOrder/CustomerOrder';
import ApprovePayments from './admin/pages/ApprovePayments' 
import InvoicePage from './pages/Invoice/InvoicePage'; 
import Success from './pages/Invoice/Success';
import Reports from './admin/pages/Reports'; 
import OrderReports from './admin/pages/OrderReports'; 


const App = () => {
  return (
    <div className='App'>
        {/* Conditionally load NavBar to hide it on pages that I need */}
        <Routes>
          <Route path='/login' element={null} />
          <Route path='/register' element={null} />
          <Route path='/dashboard-admin' element={null} /> 
          <Route path='/materials-admin' element={null} /> 
          <Route path='/details-admin' element={null} /> 
          <Route path='/products-admin' element={null} />
          <Route path='/customers-admin' element={null} />
          <Route path='/orders-admin' element={null} /> 
          <Route path='/approve-payments-admin' element={null} /> 
          <Route path='/supplier-admin' element={null} /> 
          <Route path='/adminprofile-admin' element={null} /> 
          <Route path='/checkoutpage' element={null} /> 
          <Route path='/approve-payments-admin' element={null} /> 
          <Route path='/invoice/:orderId' element={null} /> 
          <Route path='/reports-admin' element={null} /> 
          <Route path="/reports-orders" element={<null/>} />
          
          <Route path='*' element={<NavBar />} /> 
          
        </Routes>
        
        <div>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path="/customerproducts" element={<CustomerProducts />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/dashboard-admin' element={<Dashboard />} /> 
            <Route path='/materials-admin' element={<Materials />} />
            <Route path='/details-admin' element={<Details />} /> 
            <Route path='/products-admin' element={<Products />} /> 
            <Route path='/customers-admin' element={<Customer />} /> 
            <Route path='/orders-admin' element={<Orders />} /> 
            <Route path='/approve-payments-admin' element={<ApprovePayments />} /> 
            <Route path='/supplier-admin' element={<Supplier />} />
            <Route path='/adminprofile-admin' element={<AdminProfile />} /> 
            <Route path='/checkout' element={<CheckoutPage />} />
            <Route path='/checkout-advance' element={<CheckoutPageAdvance />} />
            <Route path='/customerorders' element={<CustomerOrder />} />
            <Route path="/invoice/:orderId" element={<InvoicePage />} />
            <Route path="payment-success" element={<Success />} />
            <Route path="/reports-admin" element={<Reports />} /> 
            <Route path="/reports-orders" element={<OrderReports />} />

          </Routes>
          
          {/* Conditionally load Footer to hide it on pages that I need */}
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
            <Route path="/checkoutpage" element={<null />} />
            <Route path="/approve-payments-admin" element={<null />} />
            <Route path='/invoice/:orderId' element={null} /> 
            <Route path='/reports-admin' element={null} /> 
            <Route path="/reports-orders" element={<null/>} />
            <Route path='*' element={<Footer />} />
          </Routes>
        </div>
    </div>
  );
};

export default App;


