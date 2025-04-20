import React, { useState } from 'react';
import './Register.css';
import google_icon from '../../assets/google_icon.png'; 

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  //const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
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

  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`http://localhost:5001/routes/userRoutes/check-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      return data.exists;
    } catch (err) {
      console.error("Error checking email:", err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setEmailError(null);

    if (!email) {
      setEmailError("Email is required");
      return;
    }
    // Check if email exists
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      setEmailError("Email already in use");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password does not meet requirements.");
      return;
      }
      
      const userData= {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      //agree_terms: agreeTerms,
    };

    try {
      const response = await fetch("http://localhost:5001/routes/userRoutes/register/customer", {
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
                {emailError && <p className="error-text">{emailError}</p>}
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    // Remove any non-numeric characters
                    const numericValue = e.target.value.replace(/\D/g, '');
                    setPhone(numericValue);
                  }}
                  placeholder="Mobile Number"
                  required
                />
              </div>
              
              <div className="form-group">
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
                {password && (
                  <div className="password-validation">
                    <p className={passwordErrors.length ? 'valid' : 'invalid'}>
                      ✓ At least 8 characters
                    </p>
                    <p className={passwordErrors.uppercase ? 'valid' : 'invalid'}>
                      ✓ At least one uppercase letter
                    </p>
                    <p className={passwordErrors.lowercase ? 'valid' : 'invalid'}>
                      ✓ At least one lowercase letter
                    </p>
                    <p className={passwordErrors.number ? 'valid' : 'invalid'}>
                      ✓ At least one number
                    </p>
                    <p className={passwordErrors.specialChar ? 'valid' : 'invalid'}>
                      ✓ At least one special character
                    </p>
                  </div>
                )}
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
