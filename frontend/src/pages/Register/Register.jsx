import React, { useState } from 'react';
import './Register.css';
import google_icon from '../../assets/google_icon.png'; 
import { useNavigate } from 'react-router-dom';

const Register = () => {
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  
  const navigate = useNavigate();

  // Function to validate password against multiple criteria
  const validatePassword = (password) => {
    const errors = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordErrors(errors);
    return Object.values(errors).every(Boolean);
  };

  // Main form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset all error and success messages
    setError(null);
    setSuccess(null);
    setEmailError(null);

    // Basic validation checks
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    
    // Phone number validation
    if (phone.length !== 10) {
      setPhoneError("Mobile number must be 10 digits");
      return;
    }
    
    // Password matching check
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    
    // Password strength validation
    if (!validatePassword(password)) {
      setError("Password does not meet requirements.");
      return;
    }
    
    // Prepare user data for API request
    const userData = {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      role: "customer"  // Default role for registration
    };

    try {
      // API call to register user
      const response = await fetch("http://localhost:5001/routes/userRoutes/register/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"},
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      // Handle API errors
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed. Try again.');
      }

      // Success handling - show message and redirect to login
      setSuccess("Registration successful! Please login to continue.");
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      // Error handling for API failures
      setError(err.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="register-container">
      {/* Left panel with marketing content */}
      <div className="register-left-panel">
        <div className="register-content-wrapper">
          <h1>Craft Lasting Structures with Premium Concrete</h1>
          <p>Join our community for exclusive deals on premium construction materials</p>
        </div>
      </div>
      
      {/* Right panel with registration form */}
      <div className="register-right-panel">
        <div className="register-form-container">
          <h2>SOLIDTRACK</h2>
          
          <div className="register-form-wrapper">
            <h3>Register</h3>
            <p className="register-welcome-text">Create an account to get started.</p>

            {/* Error and success message display */}
            {error && <p className="register-error-message">{error}</p>}
            {success && <p className="register-success-message">{success}</p>}
            
            <form onSubmit={handleSubmit}>
              {/* Name field */}
              <div className="register-form-group">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Name"
                  required
                />
              </div>
              
              {/* Email field with real-time validation */}
              <div className="register-form-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={async () => {
                    if (email) {
                      const exists = await checkEmailExists(email);
                      if (exists) {
                        setEmailError("Email already in use");
                      } else {
                        setEmailError(null);
                      }
                    }
                  }}
                  placeholder="Email Address"
                  required
                />
                {emailError && <p className="register-error-text">{emailError}</p>}
              </div>

              {/* Phone number field with digit validation */}
              <div className="register-form-group">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    // Remove any non-numeric characters and limit to 10 digits
                    const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhone(numericValue);
                    
                    // Validate length in real-time
                    if (numericValue.length < 10 && numericValue.length > 0) {
                      setPhoneError("Mobile number must be 10 digits");
                    } else {
                      setPhoneError(null);
                    }
                  }}
                  onBlur={() => {
                    // Final validation when leaving the field
                    if (phone.length > 0 && phone.length !== 10) {
                      setPhoneError("Mobile number must be 10 digits");
                    } else {
                      setPhoneError(null);
                    }
                  }}
                  placeholder="Mobile Number"
                  required
                />
                {phoneError && <p className="register-error-text">{phoneError}</p>}
              </div>
              
              {/* Password field with strength validation */}
              <div className="register-form-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  placeholder="Password"
                  required
                />
                {/* Password requirement indicators */}
                {password && (
                  <div className="register-password-validation">
                    <p className={passwordErrors.length ? 'valid' : 'invalid'}>
                       At least 8 characters
                    </p>
                    <p className={passwordErrors.uppercase ? 'valid' : 'invalid'}>
                       At least one uppercase letter
                    </p>
                    <p className={passwordErrors.lowercase ? 'valid' : 'invalid'}>
                       At least one lowercase letter
                    </p>
                    <p className={passwordErrors.number ? 'valid' : 'invalid'}>
                       At least one number
                    </p>
                    <p className={passwordErrors.specialChar ? 'valid' : 'invalid'}>
                       At least one special character
                    </p>
                  </div>
                )}
              </div>
              
              {/* Confirm password field */}
              <div className="register-form-group">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  required
                />
              </div>
              
              <div className="register-form-options">
                {/* Additional options can go here */}
              </div>
              
              {/* Submit button */}
              <button type="submit" className="register-button">Create Account</button>
              
              {/* Divider for alternative options */}
              <div className="register-divider">
                <span>or</span>
              </div>
              
              {/* Social login options would go here */}
            </form>
            
            {/* Link to login page for existing users */}
            <div className="register-login-prompt">
              <p>Already have an account? <a href="/login">Sign in</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;