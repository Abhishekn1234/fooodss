const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Food = require('../models/food');
const { isAdmin } = require('../middleware/adminauth');
const Order=require("../models/Order");
// Admin Login Route
router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      let user = await User.findOne({ email });
      console.log(user);
      if (!user) return res.status(401).json({ msg: 'Invalid Credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);
      if (!isMatch) return res.status(401).json({ msg: 'Invalid Credentials' });
  
      // Check if the user is an admin and set isAdmin to true
      if (user.isAdmin) {
        const payload = { admin: { id: user.id } };
        console.log(payload);
        jwt.sign(payload, 'adminJwtSecret', (err, token) => {
          if (err) throw err;
          res.json({ token });
        });
      } else {
        // If the user is not an admin, proceed with regular user login
        const payload = { user: { id: user.id } };
        jwt.sign(payload, 'jwtSecret', { expiresIn: 3600 }, (err, token) => {
          if (err) throw err;
          res.json({ token });
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  
  router.post('/admin/register', async (req, res) => {
    const { email, password, name } = req.body;
  
    try {
      let admin = await User.findOne({ email });
      if (admin) return res.status(400).json({ msg: 'Admin already exists' });
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      admin = new User({ email, password: hashedPassword, name, isAdmin: true }); // Set isAdmin to true
      await admin.save();
  
      res.json({ msg: 'Admin registered successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
// Middleware to verify admin JWT token
// Middleware to verify admin JWT token
const verifyAdminToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ msg: 'No token, authorization denied' });
  
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'No token found in authorization header' });
  
    try {
      const decoded = jwt.verify(token, 'adminJwtSecret');
      req.admin = decoded.admin;
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
    }
  };
  

// Add Food Route
router.post('/foods/add', verifyAdminToken, async (req, res) => {
  try {
    const { name, price, image, options } = req.body;
    const food = new Food({ name, price, image, options });
    await food.save();
    res.json({ message: 'Food added successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete Food Route
router.delete('/foods/:foodId/delete', verifyAdminToken, async (req, res) => {
  try {
    const food = await Food.findById(req.params.foodId);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    await food.remove();
    res.json({ message: 'Food deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update Food Route
// Update Food Route
router.put('/foods/:foodId/update', verifyAdminToken, async (req, res) => {
  try {
    const { name, price, image, options } = req.body;
    let food = await Food.findById(req.params.foodId);
    if (!food) return res.status(404).json({ message: 'Food not found' });

    food.name = name;
    food.price = price;
    food.image = image;
    food.options = options; // Assuming options is an array of objects with properties like name and price

    await food.save();
    res.json({ message: 'Food updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Get Orders Route
router.get('/orders', verifyAdminToken, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', ['name', 'email']);
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
