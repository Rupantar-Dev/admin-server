const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jwtConfig = require('../config/jwt');
const { getUsername, getPassword } = require('../utils/encryption');
const bcrypt = require('bcrypt');

const authController = {
  /**
   * Handle user login with Basic Authentication
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  login: async (req, res) => {
    try {
      // Check for Basic Authentication header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ message: 'Basic Authentication required' });
      }
      
      // Decode the base64 credentials
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [email, password] = credentials.split(':');
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      
      // Get admin credentials from .env (decrypted)
      const adminUsername = getUsername();
      const adminPassword = getPassword();
      
      let isValidCredentials = false;
      let userData = {};
      
      // First try to authenticate against hardcoded admin credentials
      if (email === adminUsername && password === adminPassword) {
        isValidCredentials = true;
        userData = {
          id: 'admin',
          email: adminUsername,
          name: 'Administrator',
          role: 'admin'
        };
      } else {
        // If not admin, check database users
        const user = await User.findByEmail(email);
        
        if (user) {
          // Check if password is correct
          const validPassword = await User.verifyPassword(password, user.password);
          if (validPassword) {
            isValidCredentials = true;
            userData = {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role || 'user'
            };
          }
        }
      }
      
      if (!isValidCredentials) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // Create and assign token
      const token = jwt.sign(
        userData, 
        jwtConfig.secret, 
        { expiresIn: jwtConfig.expiresIn }
      );
      
      res.json({ 
        token,
        user: userData
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Get current user information based on JWT token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getCurrentUser: async (req, res) => {
    try {
      // User data is already verified by JWT middleware
      // and available in req.user
      if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      // Return user data in format expected by client
      res.json({
        data: [req.user]
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = authController; 