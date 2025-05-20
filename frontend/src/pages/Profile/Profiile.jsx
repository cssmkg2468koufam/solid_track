import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [emailError, setEmailError] = useState('');
  const [initialEmail, setInitialEmail] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5001/routes/userRoutes/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
        });
        setInitialEmail(data.email); // Store the initial email
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const checkEmailAvailability = async (email) => {
    if (email === userData.email) return true;
    
    try {
      const response = await fetch(`http://localhost:5001/routes/userRoutes/check-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      return !data.exists;
    } catch (err) {
      console.error("Error checking email:", err);
      return false;
    }
  };


  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setEmailError('');

    // Validate email
    if (!userData.email || !/^\S+@\S+\.\S+$/.test(userData.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Check if email is available
    const isEmailAvailable = await checkEmailAvailability(userData.email);
    if (!isEmailAvailable) {
      setEmailError('Email already in use');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5001/routes/userRoutes/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: userData.fullName,
          phone: userData.phone,
          email: userData.email,
          currentPassword: passwordData.currentPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update token if email was changed
      if (data.token) {
        localStorage.setItem('token', data.token);
        setInitialEmail(userData.email);
      }

      setSuccess('Profile updated successfully!');
      // Clear password field after successful update
      setPasswordData(prev => ({ ...prev, currentPassword: '' }));

    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5001/routes/userRoutes/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account information and settings</p>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Information
        </button>
        <button
          className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Change Password
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="profile-content">
        {activeTab === 'profile' ? (
          <form onSubmit={handleProfileUpdate} className="profile-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={userData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                required
              />
              {emailError && <p className="error-text">{emailError}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="currentPassword">Current Password (required for email changes)</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required={userData.email !== initialEmail}
              />
            </div>

            <button type="submit" className="update-button">
              Update Profile
            </button>

          </form>
        ) : (
          <form onSubmit={handlePasswordUpdate} className="password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <button type="submit" className="update-button">
              Change Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;