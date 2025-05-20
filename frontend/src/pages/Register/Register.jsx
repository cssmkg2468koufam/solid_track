import React, { useState } from 'react';
import './Register.css';
import google_icon from '../../assets/google_icon.png'; 

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const userData= {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      //agree_terms: agreeTerms,
    };

    try {
      const response = await fetch("http://localhost:5002/routes/userRoutes/register/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"},
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Try again.');
      }

      setSuccess("Registration successful! Please login to continue.");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="left-panel">
        <div className="content-wrapper">
          <h1>Craft Lasting Structures with Premium Concrete</h1>
          <p>Join our community for exclusive deals on premium construction materials</p>
        </div>
      </div>
      
      <div className="right-panel">
        <div className="form-container">
          <h2>SOLIDTRACK</h2>
          
          <div className="register-form-wrapper">
            <h3>Register</h3>
            <p className="welcome-text">Create an account to get started.</p>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Mobile Number"
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  required
                />
              </div>
              
              <div className="form-options">
                {/* <div className="terms-checkbox">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={() => setAgreeTerms(!agreeTerms)}
                    required
                  />
                  <label htmlFor="terms">I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></label>
                </div> */}
              </div>
              
              <button type="submit" className="register-button">Create Account</button>
              
              <div className="divider">
                <span>or</span>
              </div>
              
              <button type="button" className="google-button">
                <img src={google_icon} alt="Google" />
                Sign Up With Google
              </button>
            </form>
            
            <div className="login-prompt">
              <p>Already have an account? <a href="/login">Sign in</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
