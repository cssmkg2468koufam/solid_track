import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './AppAdmin.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
const Orders = () => {
const [searchTerm, setSearchTerm] = useState('');


    const orders = [
        {
            orderId: "#0014",
            deliveryDate: "04/30/2024",
            customer: "Samarasinghe",
            fullAmount: "1000",
            location: "Kurunegala",
            quantity: "3",
            status: "Pending"
        },
        {
            orderId: "#0016",
            deliveryDate: "04/30/2024",
            customer: "Gunawardhana",
            fullAmount: "2000",
            location: "Polgahawela",
            quantity: "3",
            status: "Pending"
        }
    ];

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:5001/routes/orderRoutes/get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            console.error(err.message);
        }
    }
    useEffect(() => {
        fetchOrders();
    }
    , []);

    const handleEdit = (order) => {
        // Implement edit functionality here
        console.log('Edit order:', order);
    }
    const handleDelete = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                const response = await fetch(`http://localhost:5001/routes/orderRoutes/delete/${orderId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (err) {
                console.error(err.message);
            }
        }
    }

    return (
    <div className="grid-container">
        <Header />
        <Sidebar />
    <div className="order-page">
        <div className="header">
            <h1>Orders</h1>
            <div className="header-actions">
                <button className="export-btn">Export</button>
                <button className="new-btn">Add Order</button>
            </div>
        </div>

        <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-section">
         (
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Delivery Date</th>
                <th>Customer</th>
                <th>Full Amount</th>
                <th>Location</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{order.deliveryDate}</td>
                    <td>{order.customer}</td>
                    <td>{order.fullAmount}</td>
                    <td>{order.location}</td>
                    <td>{order.quantity}</td>
                    <td>{order.status}</td>
                    <td>
                        <FaEdit className="edit-icon" onClick={() => handleEdit(customer)} />
                        <FaTrash className="delete-icon" onClick={() => handleDelete(customer?.customer_id)} />
                    </td>
                    </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    {customers.length === 0 ? 'No customers available' : 'No matching customers found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )
      </div>
    </div> 
    </div>

    );
}

export default Orders;
