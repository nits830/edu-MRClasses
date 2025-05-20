const jwt = require('jsonwebtoken');
const { Admin } = require('../models/Admin');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to verify admin role
const verifyAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ message: 'Admin account is inactive' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error verifying admin' });
  }
};


// Middleware to verify user role

// Middleware to verify admin role
const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Admin account is inactive' });
    }
 
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error verifying user' });
  }
};


// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyUser,
  errorHandler
}; 