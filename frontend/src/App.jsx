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
import Dashboard from './admin/pages/Dashboard' // Import the Admin App component
import Materials from './admin/pages/Materials'
import Details from './admin/pages/Details'
import Customer from './admin/pages/Customer'
import Orders from './admin/pages/Orders'
import Products from './admin/pages/Products'
import Supplier from './admin/pages/Supplier'
import AdminProfile from './admin/pages/AdminProfile' // Import the Admin Profile component
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import CheckoutPageAdvance from './pages/CheckoutPage/CheckoutPageAdvance';
import CustomerOrder from './pages/CustomerOrder/CustomerOrder';
import ApprovePayments from './admin/pages/ApprovePayments' // Import the Admin App component
import InvoicePage from './pages/Invoice/InvoicePage'; // Import the InvoicePage component
import Success from './pages/Invoice/Success';
import Reports from './admin/pages/Reports'; // Import the Reports component
import SalesReport from './admin/pages/SalesReport'; // Import the SalesReport component
import OrderReports from './admin/pages/OrderReports'; // Import the OrderReports component


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
          <Route path='/approve-payments-admin' element={null} /> {/* Admin App component */}
          <Route path='/supplier-admin' element={null} /> {/* Admin App component */}
          <Route path='/adminprofile-admin' element={null} /> {/* Admin Profile component */}
          <Route path='/checkoutpage' element={null} /> {/* Admin Profile component */}
          <Route path='/approve-payments-admin' element={null} /> {/* Admin Profile component */}
          <Route path='/invoice/:orderId' element={null} /> {/* Admin Profile component */}
          <Route path='/reports-admin' element={null} /> {/* Admin Profile component */}
          <Route path="/salesreport" element={<SalesReport />} />
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
            <Route path='/dashboard-admin' element={<Dashboard />} /> {/* Admin App component */}
            <Route path='/materials-admin' element={<Materials />} /> {/* Admin App component */}
            <Route path='/details-admin' element={<Details />} /> {/* Admin App component */}
            <Route path='/products-admin' element={<Products />} /> {/* Admin App component */}
            <Route path='/customers-admin' element={<Customer />} /> {/* Admin App component */}
            <Route path='/orders-admin' element={<Orders />} /> {/* Admin App component */}
            <Route path='/approve-payments-admin' element={<ApprovePayments />} /> {/* Admin App component */}
            <Route path='/supplier-admin' element={<Supplier />} /> {/* Admin App component */}
            <Route path='/adminprofile-admin' element={<AdminProfile />} /> {/* Admin Profile component */}
            <Route path='/checkout' element={<CheckoutPage />} />
            <Route path='/checkout-advance' element={<CheckoutPageAdvance />} />
            <Route path='/customerorders' element={<CustomerOrder />} />
            <Route path="/invoice/:orderId" element={<InvoicePage />} />
            <Route path="payment-success" element={<Success />} />
            <Route path="/reports-admin" element={<Reports />} /> {/* Admin App component */}
            <Route path="/salesreport" element={<SalesReport />} />
            <Route path="/reports-orders" element={<OrderReports />} />

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
            <Route path="/checkoutpage" element={<null />} />
            <Route path="/approve-payments-admin" element={<null />} />
            <Route path='/invoice/:orderId' element={null} /> {/* Admin Profile component */}
            <Route path='/reports-admin' element={null} /> 
            <Route path="/salesreport" element={null} />
            <Route path="/reports-orders" element={<null/>} />
            <Route path='*' element={<Footer />} />
          </Routes>
        </div>
    </div>
  );
};

export default App;


