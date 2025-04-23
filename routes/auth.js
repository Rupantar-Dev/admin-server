const express = require('express');
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Login endpoint - handles Basic Authentication and returns JWT
router.get('/login', authController.login);

// Get current user endpoint - requires JWT
router.get('/', verifyToken, authController.getCurrentUser);

module.exports = router; 