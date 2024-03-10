// models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  cartItems: { type: Array, required: true },
  Name:{type:String,required:true},
  // Add any other fields you need for the order
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
