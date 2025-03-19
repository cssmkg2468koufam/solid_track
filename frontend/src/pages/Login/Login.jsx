import React, { useState } from 'react';
import './Login.css';
import google_icon from '../../assets/google_icon.png'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  
  const [successMessage, setSuccessMessage] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch("http://localhost:5002/routes/userRoutes/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setSuccessMessage("Login successful!");
      console.log("Logged in user:", data.user);
      
      // Store user in local storage
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to homepage after successful login
      window.location.href = "/home";
    } catch (err) {
      setError(err.message);
    }
  };

  const navigateToRegister = () => {
    window.location.href = "/register";
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <div className="content-wrapper">
          <h1>Craft Lasting Structures with Premium Concrete</h1>
          <p>Join our community for exclusive deals on premium construction materials</p>
        </div>
      </div>
      
      <div className="right-panel">
        <div className="form-container">
          <h2>SOLIDTRACK</h2>
          
          <div className="login-form-wrapper">
            <h3>Login</h3>
            <p className="welcome-text">Welcome Back! Please enter your details.</p>

            {error && <p className="error-message">{error}</p>} {/* ✅ Display error */}
            {successMessage && <p className="success-message">{successMessage}</p>} {/* ✅ Display success message */}

            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
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
              
              <div className="form-options">
                
                <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
              </div>
              
              <button type="submit" className="login-button">Log in</button>
              
              <div className="divider">
                <span>or</span>
              </div>
              
              <button type="button" className="google-button">
                <img src={google_icon} alt="Google" />
                Sign In With Google
              </button>
            </form>
            
            <div className="register-prompt">
              <p>Don't have an account? <a href="/register" onClick={(e) => {e.preventDefault(); navigateToRegister();}}>Sign up for free</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;