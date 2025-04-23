/**
 * Utility script to generate encryption keys and encrypt credentials
 * Run with: node utils/generateEncryption.js
 */

const crypto = require('crypto');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Generate a random encryption key
function generateEncryptionKey() {
  // Generate a 32-byte (256-bit) random key
  return crypto.randomBytes(32).toString('hex');
}

// Encrypt text with the given key
function encryptText(text, key) {
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
  // The IV needs to be stored with the encrypted data for decryption
  return iv.toString('hex') + ':' + encrypted;
}

// Main function
async function main() {
  // Generate a new encryption key
  const encryptionKey = generateEncryptionKey();
  console.log('\n=== ENCRYPTION KEY (store this securely) ===');
  console.log(encryptionKey);
  
  // Get username from user input
  const username = await new Promise((resolve) => {
    rl.question('\nEnter username to encrypt: ', (answer) => resolve(answer));
  });
  
  // Get password from user input
  const password = await new Promise((resolve) => {
    rl.question('Enter password to encrypt: ', (answer) => resolve(answer));
  });
  
  // Encrypt the credentials
  const encryptedUsername = encryptText(username, encryptionKey);
  const encryptedPassword = encryptText(password, encryptionKey);
  
  console.log('\n=== ENCRYPTED CREDENTIALS (add to .env file) ===');
  console.log(`ENCRYPTION_KEY=${encryptionKey}`);
  console.log(`ENCRYPTED_USERNAME=${encryptedUsername}`);
  console.log(`ENCRYPTED_PASSWORD=${encryptedPassword}`);
  
  // Add example of .env file
  console.log('\n=== EXAMPLE .ENV FILE ===');
  console.log(`DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="${crypto.randomBytes(32).toString('base64')}"
PORT=3000
ENCRYPTION_KEY=${encryptionKey}
ENCRYPTED_USERNAME=${encryptedUsername}
ENCRYPTED_PASSWORD=${encryptedPassword}`);
  
  rl.close();
}

main().catch(console.error); 