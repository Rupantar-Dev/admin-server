const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Middleware to protect all routes
router.use(verifyToken);

// GET all subscriptions with pagination
router.get('/', subscriptionController.getAll);

// GET a single subscription by ID
router.get('/:id', subscriptionController.getById);

// POST to create/update a subscription
router.post('/', subscriptionController.createOrUpdate);

// DELETE a subscription
router.delete('/:id', subscriptionController.delete);

module.exports = router; 