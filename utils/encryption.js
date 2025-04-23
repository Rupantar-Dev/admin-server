/**
 * Utility module for encrypting and decrypting data
 */
const crypto = require('crypto');
require('dotenv').config();

/**
 * Decrypt text with the encryption key from .env
 * @param {string} encryptedText - The encrypted text (format: iv:encryptedData)
 * @returns {string} The decrypted text
 */
function decryptText(encryptedText) {
  try {
    // Get the encryption key from .env
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
      throw new Error('Encryption key not found in environment variables');
    }

    // Split the IV and encrypted data
    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted text format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];

    // Create a buffer from the hex key
    const keyBuffer = Buffer.from(key, 'hex');

    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);

    // Decrypt the data
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error.message);
    // Return empty string on error
    return '';
  }
}

/**
 * Get decrypted username from .env
 * @returns {string} Decrypted username
 */
function getUsername() {
  const encryptedUsername = process.env.ENCRYPTED_USERNAME;
  if (!encryptedUsername) {
    console.error('Encrypted username not found in environment variables');
    return '';
  }
  return decryptText(encryptedUsername);
}

/**
 * Get decrypted password from .env
 * @returns {string} Decrypted password
 */
function getPassword() {
  const encryptedPassword = process.env.ENCRYPTED_PASSWORD;
  if (!encryptedPassword) {
    console.error('Encrypted password not found in environment variables');
    return '';
  }
  return decryptText(encryptedPassword);
}

/**
 * Encrypt text with the encryption key from .env
 * @param {string} text - The text to encrypt
 * @returns {string} The encrypted text (format: iv:encryptedData)
 */
function encryptText(text) {
  try {
    // Get the encryption key from .env
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
      throw new Error('Encryption key not found in environment variables');
    }

    // Create a buffer from the hex key
    const keyBuffer = Buffer.from(key, 'hex');
    
    // Generate a random initialization vector
    const iv = crypto.randomBytes(16);
    
    // Create cipher using AES-256-CBC algorithm
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return the IV and encrypted data as a single string
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error.message);
    // Return empty string on error
    return '';
  }
}

module.exports = {
  decryptText,
  encryptText,
  getUsername,
  getPassword
}; 