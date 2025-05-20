
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import './CheckoutPage.css';

const stripePromise = loadStripe('pk_test_51RNVXHF2XYRh3d2iLEcpEx2QodkbOO76ENgN6RffgmKp90kgpnXvSt0BInWFcBfXfivtNXquLFXO95emR40wedBV005zYzTaG4');

const CheckoutPageAdvance = () => {
  const { state } = useLocation();
  const { order_id, remain_balance } = state || {};
  const [selectedOption, setSelectedOption] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Validate and redirect if necessary parameters are missing
  if (!order_id || !remain_balance) {
    navigate('/customerorders');
    return null;
  }

  const handleFileChange = (e) => {
    setReceiptFile(e.target.files[0]);
    setErrorMessage('');
  };

  const handleSubmitReceipt = async (e) => {
    e.preventDefault();
    if (!receiptFile) {
      setErrorMessage('Please upload a receipt file');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const token = localStorage.getItem('token');
      const customerData = JSON.parse(localStorage.getItem("customer"));
      const customer_id = customerData?.customer_id;

      const formData = new FormData();
      formData.append('order_id', order_id);
      formData.append('customer_id', customer_id);
      formData.append('amount', remain_balance);
      formData.append('payment_method', 'bank_transfer');
      formData.append('receipt', receiptFile);

      const response = await fetch('http://localhost:5001/routes/paymentRoutes/upload-receipt', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload receipt');
      }

      setUploadSuccess(true);
      setReceiptFile(null);

      // Update order status to 'paid' after successful payment
      await updateOrderStatus(order_id, 'paid');

      setTimeout(() => {
        navigate(`/invoice/${order_id}`);
      }, 3000);
      
    } catch (error) {
      console.error('Error uploading receipt:', error);
      setErrorMessage(error.message || 'Failed to upload receipt');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/routes/paymentRoutes/update-order-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          order_id: orderId,
          status: status
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  
  const handleStripePayment = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const stripe = await stripePromise;

      const response = await fetch(
        'http://localhost:5001/routes/paymentRoutes/create-checkout-session',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_id,
            amount: Math.round(remain_balance )
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Payment processing failed');
      }

      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setErrorMessage(error.message || 'Payment processing failed');
    } finally {
      setIsSubmitting(false);
    }
  };
  const remainingBalance = remain_balance/100;

  return (
    <div className="checkout-container">
      <h1>Complete Your Payment</h1>
      <div className="order-summary">
        <h2>Order #{order_id}</h2>
        <p className="remaining-balance">Remaining Balance: Rs. {remainingBalance.toLocaleString()}</p>
      </div>

      {uploadSuccess && (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h3>Payment Receipt Uploaded Successfully!</h3>
          <p>Your payment is being processed. You'll be redirected to your invoice shortly.</p>
        </div>
      )}

      {errorMessage && (
        <div className="error-message">
          <div className="error-icon">!</div>
          <p>{errorMessage}</p>
        </div>
      )}

      {!uploadSuccess && (
        <div className="payment-options">
          <h2>Select Payment Method</h2>
          
          <div className="payment-method">
            <input 
              type="radio" 
              id="upload-receipt" 
              name="paymentMethod" 
              checked={selectedOption === 'upload'}
              onChange={() => setSelectedOption('upload')}
              disabled={isSubmitting}
            />
            <label htmlFor="upload-receipt">Upload Payment Receipt</label>
          </div>

          <div className="payment-method">
            <input 
              type="radio" 
              id="online-payment" 
              name="paymentMethod" 
              checked={selectedOption === 'online'}
              onChange={() => setSelectedOption('online')}
              disabled={isSubmitting}
            />
            <label htmlFor="online-payment">Online Payment</label>
          </div>

          {selectedOption === 'upload' && (
            <form onSubmit={handleSubmitReceipt} className="upload-form">
              <div className="form-group">
                <label htmlFor="receipt">Upload Bank Transfer Receipt:</label>
                <input 
                  type="file" 
                  id="receipt" 
                  accept="image/*,.pdf" 
                  onChange={handleFileChange}
                  required
                  disabled={isSubmitting}
                />
                <p className="file-hint">Accepted formats: JPG, PNG, PDF (Max 5MB)</p>
              </div>
              <button type="submit" disabled={isSubmitting} className="submit-btn">
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : 'Submit Receipt'}
              </button>
            </form>
          )}

          {selectedOption === 'online' && (
            <div className="stripe-payment">
              <button 
                className="payment-btn active" 
                onClick={handleStripePayment} 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : `Pay Remaining Balance (Rs. ${remainingBalance.toLocaleString()})`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutPageAdvance;