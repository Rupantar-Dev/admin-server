const prisma = require('../config/database');

const ShopSubscription = {
  /**
   * Get all shop subscriptions with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Paginated shop subscription data
   */
  getAll: async (page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const total = await prisma.shopSubscription.count();
    
    // Get paginated data
    const data = await prisma.shopSubscription.findMany({
      skip,
      take: limit,
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  },

  /**
   * Get a subscription by ID
   * @param {string} id - Subscription ID
   * @returns {Promise<Object>} Shop subscription
   */
  getById: async (id) => {
    return await prisma.shopSubscription.findUnique({
      where: { id }
    });
  },

  /**
   * Create a new shop subscription
   * @param {Object} data - Shop subscription data
   * @returns {Promise<Object>} Created subscription
   */
  create: async (data) => {
    // Make sure updatedAt is set
    const subscriptionData = {
      ...data,
      updatedAt: new Date()
    };
    
    return await prisma.shopSubscription.create({
      data: subscriptionData
    });
  },

  /**
   * Update an existing shop subscription
   * @param {string} id - Subscription ID
   * @param {Object} data - Data to update
   * @returns {Promise<Object>} Updated subscription
   */
  update: async (id, data) => {
    // Always update the updatedAt field
    const updateData = {
      ...data,
      updatedAt: new Date()
    };
    
    return await prisma.shopSubscription.update({
      where: { id },
      data: updateData
    });
  },

  /**
   * Delete a shop subscription
   * @param {string} id - Subscription ID
   * @returns {Promise<Object>} Deleted subscription
   */
  delete: async (id) => {
    return await prisma.shopSubscription.delete({
      where: { id }
    });
  }
};

module.exports = ShopSubscription; 