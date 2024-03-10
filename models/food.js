const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    name: String,
    price: Number
});

const foodSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    options: [optionSchema], 
    category: String,
    image: String
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
