// File: server/controllers/dashboard.controller.js

const Sale = require('../models/sale.model');
const Product = require('../models/product.model');
const Customer = require('../models/customer.model');

// @desc   Get dashboard stats
// @route  GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    // 1. Get stats for "Today"
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Set to midnight this morning

    const todaySales = await Sale.find({
      createdAt: { $gte: todayStart },
    });

    // Calculate total sales amount for today
    const totalSalesToday = todaySales.reduce(
      (acc, sale) => acc + sale.totalAmount,
      0
    );
    
    // Total orders for today
    const totalOrdersToday = todaySales.length;

    // 2. Get Total Customers
    const totalCustomers = await Customer.countDocuments();

    // 3. Get Low Stock Products (stock <= 10)
    // We only send the top 5 for the dashboard summary
    const lowStockProducts = await Product.find({ stock: { $lte: 10 } })
      .limit(5)
      .select('name stock'); // Only select name and stock fields

    // 4. Send all stats as one object
    res.status(200).json({
      totalSalesToday,
      totalOrdersToday,
      totalCustomers,
      lowStockProducts,
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
};