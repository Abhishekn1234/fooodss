// routes/checkout.js

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/user');
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.delete('/orders/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    // Find the order by ID and delete it
    await Order.findByIdAndDelete(orderId);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /checkout
router.post('/orders', async (req, res) => {
  try {
    // Extract data from request body
    const { email, cartItems,Name } = req.body;

    // Create a new order instance
    const order = new Order({
      email,
      cartItems,
      Name,
      // Add any other fields you need for the order
    });

    // Save the order to the database
    await order.save();

    // Increment the orderCount for the user
    const user = await User.findOneAndUpdate(
      { email },
      { $inc: { orderCount: 1 } }, // Increment the orderCount by 1
      { new: true }
    );

    // Send a response indicating successful checkout
    res.status(200).json({ message: 'Checkout successful' });
  } catch (error) {
    console.error('Checkout error:', error.message);
    res.status(500).json({ message: 'Checkout failed. Please try again later.' });
  }
});

module.exports = router;
