import React, { useState } from 'react';
import './Login.css';
import google_icon from '../../assets/google_icon.png'; 
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const[id, setId] = useState('');
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
      console.log("Logged in user:", data);
      console.log("error:", data.error); // Log error if any

      localStorage.setItem("token", data.user.token );
      
      // localStorage.setItem("user", JSON.stringify({
      //   id: data.user.id,
      //   name: data.user.fullName || data.user.email,
      //   email: data.user.email,
      //   phone: data.user.phone || '',
      //   role: data.user.role,
      // }));
      console.log("User role:", data.user.role); // Log user role
      console.log("id:", data.user.id); // Log user ID
      
      if (data.user.role === 'customer') {
        localStorage.setItem("customer", JSON.stringify({
          username: data.user.fullName,
          email: data.user.email,
          phone: data.user.phone,
          customer_id: data.user.id,
          role:data.user.role,
          
        })); // Store customer details

        navigate("/")
        
      } else if(data.user.role === 'admin') {
        console.log("Admin role detected"); // Log admin role detection
        console.log("Admin data:", data); // Log admin data
        localStorage.setItem("admin", JSON.stringify({
          email: data.user.email,
          admin_id: data.user.id,
          role:data.user.role,
        })); // Store admin details

        navigate("/dashboard-admin")
      } else {
        throw new Error("Invalid user ");
      }
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

            {error && <p className="error-message">{error}</p>} {/* Display error */}
            {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}

            
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
              <p>Don't have an account? <a href="/register" onClick={(e) => {e.preventDefault(); navigateToRegister();}}>Sign up</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;