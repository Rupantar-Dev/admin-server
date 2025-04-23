require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET,
  expiresIn: '7d' // Token expires in 1 week
}; 