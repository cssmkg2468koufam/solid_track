import React, { useState } from 'react';
import './Login.css';
import google_icon from '../../assets/google_icon.png'; 
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  
  const [successMessage, setSuccessMessage] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch("http://localhost:5001/routes/userRoutes/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setSuccessMessage("Login successful!");
      localStorage.setItem("token", data.user.token);
      
      if (data.user.role === 'customer') {
        localStorage.setItem("customer", JSON.stringify({
          username: data.user.fullName,
          email: data.user.email,
          phone: data.user.phone,
          customer_id: data.user.id,
          role: data.user.role,
        }));
        navigate("/");
      } else if(data.user.role === 'admin') {
        localStorage.setItem("admin", JSON.stringify({
          email: data.user.email,
          admin_id: data.user.id,
          role: data.user.role,
        }));
        navigate("/dashboard-admin");
      } else {
        throw new Error("Invalid user role");
      }
    } catch (err) {
      setError(err.message);  
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-left-panel">
        <div className="login-content-wrapper">
          <h1 className="login-hero-title">Craft Lasting Structures with Premium Concrete</h1>
          <p className="login-hero-subtitle">Join our community for exclusive deals on premium construction materials</p>
        </div>
      </div>
      
      <div className="login-right-panel">
        <div className="login-form-container">
          <h2 className="login-brand-title">SOLIDTRACK</h2>
          
          <div className="login-form-wrapper">
            <h3 className="login-form-title">Login</h3>
            <p className="login-welcome-text">Welcome Back! Please enter your details.</p>

            {error && <p className="login-error-message">{error}</p>}
            {successMessage && <p className="login-success-message">{successMessage}</p>}
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-form-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="login-input"
                  required
                />
              </div>
              
              <div className="login-form-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="login-input"
                  required
                />
              </div>
              
              <button type="submit" className="login-submit-button">Log in</button>
              
              <div className="login-divider">
                <span className="login-divider-text">or</span>
              </div>
              
              <button type="button" className="login-google-button">
                <img src={google_icon} alt="Google" className="login-google-icon" />
                Sign In With Google
              </button>
            </form>
            
            <div className="login-register-prompt">
              <p>Don't have an account? <a href="/register" className="login-register-link" onClick={(e) => {e.preventDefault(); navigate('/register');}}>Sign up</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;