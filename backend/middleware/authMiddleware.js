const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, 'your_jwt_secret');

      // Add user data to request object
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };

      console.log('User authenticated:', req.user);
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};

module.exports = { protect };