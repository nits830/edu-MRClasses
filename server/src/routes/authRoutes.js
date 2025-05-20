const express = require('express');
const router = express.Router();
const { adminLogin, userLogin } = require('../controllers/authController');
const { validateAdmin } = require('../models/Admin');

// Admin routes
router.post('/admin/login', adminLogin);

// User routes
router.post('/user/login', userLogin);

module.exports = router; 