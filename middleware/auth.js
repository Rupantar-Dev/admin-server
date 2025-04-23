const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Invalid token format.' });
  }

  try {
    const verified = jwt.verify(token, jwtConfig.secret);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken; 