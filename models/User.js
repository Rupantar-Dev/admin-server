const prisma = require('../config/database');
const bcrypt = require('bcrypt');

const User = {
  /**
   * Find a user by email
   * @param {string} email 
   * @returns {Promise<Object>} User object
   */
  findByEmail: async (email) => {
    return await prisma.user.findUnique({
      where: { email }
    });
  },

  /**
   * Verify password against hashed password
   * @param {string} password - Plain text password
   * @param {string} hashedPassword - Hashed password from database
   * @returns {Promise<boolean>} True if password matches
   */
  verifyPassword: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  }
};

module.exports = User; 