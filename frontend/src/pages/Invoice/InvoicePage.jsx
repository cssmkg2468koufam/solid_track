import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './InvoicePage.css';

const InvoicePage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        // Check for temp data first
        const tempData = sessionStorage.getItem('tempPaymentData');
        if (tempData) {
          const { order_id, amount, remain_balance, status } = JSON.parse(tempData);
          setOrder({
            order_id,
            status,
            total: parseFloat(amount) + (remain_balance ? parseFloat(remain_balance) : 0),
            remain_balance: remain_balance || '0'
          });
          
          if (status === 'advanced-paid') {
            setPaymentDetails({
              amount: amount,
              remain_balance: remain_balance
            });
          }
          
          sessionStorage.removeItem('tempPaymentData');
          setLoading(false);
          return;
        }
        const token = localStorage.getItem('token');
        // Fetch order details
        const orderResponse = await fetch(`http://localhost:5001/routes/orderRoutes/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!orderResponse.ok) {
          throw new Error('Failed to fetch order details');
        }

        const orderData = await orderResponse.json();
        setOrder(orderData);

        // Fetch payment details if status is advanced-paid
        if (orderData.status === 'advanced-paid') {
          const paymentResponse = await fetch(`http://localhost:5001/routes/paymentRoutes/payment-details/${orderId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });

          if (!paymentResponse.ok) {
            throw new Error('Failed to fetch payment details');
          }

          const paymentData = await paymentResponse.json();
          setPaymentDetails(paymentData);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching details:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePrint = () => {
    window.print();
  };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner"></div>
//         <p>Loading invoice...</p>
//         {order_id && <p>Order ID: {order_id}</p>}
//       </div>
//     );
// }

if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Invoice</h2>
        <p>{error}</p>
        <p>Order ID: {orderId}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Try Again
        </button>
      </div>
    );
}

if (!order) {
    return (
      <div className="error-container">
        <h2>No Order Data Found</h2>
        <p>We couldn't find any data for order #{orderId}</p>
      </div>
    );
}

  return (
    <div className="invoice-page">
      <div className="invoice-container">
        <div className="invoice-header">
          <h1>Invoice</h1>
          <div className="invoice-meta">
            <p>Invoice #: {order.order_id}</p>
            <p>Date: {formatDate(new Date())}</p>
          </div>
        </div>

        <div className="invoice-details">
          <div className="customer-info">
            <h3>Bill To:</h3>
            <p>{order.customer_name || 'Customer Name'}</p>
            <p>{order.location || 'Customer Address'}</p>
          </div>

          <div className="order-info">
            <h3>Order Details:</h3>
            <p>Order #: {order.order_id}</p>
            <p>Order Date: {formatDate(order.created_at)}</p>
            <p>Delivery Date: {formatDate(order.delivery_date)}</p>
            <p>Status: {order.status}</p>
          </div>
        </div>

        <table className="invoice-items">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td>{item.product_name}</td>
                <td>{item.quantity}</td>
                <td>Rs. {item.price_of_one_product.toLocaleString()}</td>
                <td>Rs. {(item.quantity * item.price_of_one_product).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>Rs. {order.total.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Tax (0%):</span>
            <span>Rs. 0</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount:</span>
            <span>Rs. {order.total.toLocaleString()}</span>
          </div>

          {/* Payment Details Section */}
          {order.status === 'advanced-paid' && paymentDetails && (
            <>
              <div className="summary-row">
                <span>Advance Paid:</span>
                <span>Rs. {paymentDetails.amount.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Remaining Balance:</span>
                <span>Rs. {paymentDetails.remain_balance.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Payment Status:</span>
                <span>Advanced Payment (Partial)</span>
              </div>
            </>
          )}

          {order.status === 'paid' && (
            <div className="summary-row">
              <span>Payment Status:</span>
              <span>Fully Paid</span>
            </div>
          )}
        </div>

        <div className="invoice-footer">
          <p>Thank you for your business!</p>
          <div className="invoice-actions">
            <button onClick={handlePrint} className="print-btn">
              Print Invoice
            </button>
            <button onClick={() => navigate('/customerorders')} className="back-btn">
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;