const ShopSubscription = require('../models/ShopSubscription');
const { v4: uuidv4 } = require('uuid');

const subscriptionController = {
  /**
   * Get all subscriptions with pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      
      const result = await ShopSubscription.getAll(page, limit);
      res.json(result);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
    }
  },

  /**
   * Get a single subscription by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const subscription = await ShopSubscription.getById(id);
      
      if (!subscription) {
        return res.status(404).json({ message: 'Subscription not found' });
      }
      
      res.json(subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      res.status(500).json({ message: 'Error fetching subscription', error: error.message });
    }
  },

  /**
   * Create or update a subscription
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  createOrUpdate: async (req, res) => {
    try {
      const data = req.body;
      let subscription;
      
      if (data.id) {
        // If ID is provided, update existing record
        const id = data.id;
        delete data.id; // Remove ID from data
        
        subscription = await ShopSubscription.update(id, data);
        res.json(subscription);
      } else {
        // Create new record
        // Generate UUID for new subscriptions
        const newData = {
          ...data,
          id: uuidv4()
        };
        
        subscription = await ShopSubscription.create(newData);
        res.status(201).json(subscription);
      }
    } catch (error) {
      console.error('Error saving subscription:', error);
      res.status(500).json({ message: 'Error saving subscription', error: error.message });
    }
  },

  /**
   * Delete a subscription
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      
      const subscription = await ShopSubscription.getById(id);
      if (!subscription) {
        return res.status(404).json({ message: 'Subscription not found' });
      }
      
      await ShopSubscription.delete(id);
      res.json({ message: 'Subscription deleted successfully' });
    } catch (error) {
      console.error('Error deleting subscription:', error);
      res.status(500).json({ message: 'Error deleting subscription', error: error.message });
    }
  }
};

module.exports = subscriptionController; 