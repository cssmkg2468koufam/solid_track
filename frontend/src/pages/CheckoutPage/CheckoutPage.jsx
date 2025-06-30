import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import './CheckoutPage.css';

// Initialize Stripe with test public key
const stripePromise = loadStripe('pk_test_51RNVXHF2XYRh3d2iLEcpEx2QodkbOO76ENgN6RffgmKp90kgpnXvSt0BInWFcBfXfivtNXquLFXO95emR40wedBV005zYzTaG4');


const CheckoutPage = () => {
  const { state } = useLocation();
  const { order_id, total } = state || {};
  const [selectedOption, setSelectedOption] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

   const advance = total * 0.3;
  const balance = total - advance;
  
  // Redirect if order details are missing
  if (!order_id || !total) {
    navigate('/customerorders');
    return null;
  }

  const handleFileChange = (e) => {
    setReceiptFile(e.target.files[0]);
    setErrorMessage('');
  };
  // Handle bank transfer receipt upload
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
      // Prepare form data with payment details and receipt
      const formData = new FormData();
      formData.append('order_id', order_id);
      formData.append('customer_id', customer_id);
      formData.append('amount', total);
      formData.append('payment_method', 'bank_transfer');
      formData.append('receipt', receiptFile);
      // API call to upload receipt
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
      // Handle success - redirect to invoice after delay
      setUploadSuccess(true);
      setReceiptFile(null);

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
   // Handle advance payment via Stripe (30% of total)
  const handleAdvancePayment = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const stripe = await stripePromise;
      // Create Stripe checkout session for advance payment
      const response = await fetch(
        'http://localhost:5001/routes/paymentRoutes/create-advance-checkout-session',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_id,
            amount: advance* 100,
            remain_balance: balance * 100,
           
          }),
        }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Payment processing failed');
      }
      // Redirect to Stripe checkout
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
  // Handle full payment via Stripe
  const handleStripePayment = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    

    try {
      const stripe = await stripePromise;
      // Create Stripe checkout session for full payment
      const response = await fetch(
        'http://localhost:5001/routes/paymentRoutes/create-checkout-session',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_id,
        amount: total * 100,
        
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Payment processing failed');
      }
       // Redirect to Stripe checkout
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Error processing payment advanced:', error);
      setErrorMessage(error.message || 'Payment processing failed');
    } finally {
      setIsSubmitting(false);
    }
  };

 

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="order-summary">
        <h2>Order #{order_id}</h2>
        <p>Total Amount: Rs. {total.toLocaleString()}</p>
        <p>Advance Payment: Rs. {advance.toLocaleString()}</p>
        <p>Balance Payment: Rs. {balance.toLocaleString()} (pay after arrange the order)</p>
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
       {/* Payment method selection */}
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
            <label htmlFor="online-payment">Online Payment </label>
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
    <p>Select Payment Amount:</p>
    <div className="payment-choice-buttons">
      <button 
        className={`payment-btn ${selectedOption === 'advance' ? 'active' : ''}`} 
        onClick={ handleAdvancePayment} 
        disabled={isSubmitting}
      >
        Pay Advance (Rs. {advance.toLocaleString()})
      </button>
      <button 
        className={`payment-btn ${selectedOption === 'full' ? 'active' : ''}`} 
        onClick={ handleStripePayment} 
        disabled={isSubmitting}
      >
        Pay Full (Rs. {total.toLocaleString()})
      </button>
    </div>
  </div>
)}

        </div>
      )}
    </div>
  );
};

export default CheckoutPage;