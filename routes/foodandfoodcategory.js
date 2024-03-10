// routes/food.js
const express = require('express');
const router = express.Router();
const Food = require('../models/food');
const Category = require('../models/foodcategory');

// Get all categories
router.get('/category', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific category
router.get('/category/:id', getCategory, (req, res) => {
    res.json(res.category);
});

// Create a category
router.post('/category', async (req, res) => {
    const category = new Category({
        category: req.body.category,
        description: req.body.description
    });
    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a category
router.patch('/category/:id', getCategory, async (req, res) => {
    if (req.body.category != null) {
        res.category.category = req.body.category;
    }
    if (req.body.description != null) {
        res.category.description = req.body.description;
    }
    try {
        const updatedCategory = await res.category.save();
        res.json(updatedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a category
router.delete('/category/:id', getCategory, async (req, res) => {
    try {
        await res.category.remove();
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getCategory(req, res, next) {
    try {
        const category = await Category.findById(req.params.id);
        if (category == null) {
            return res.status(404).json({ message: 'Cannot find category' });
        }
        res.category = category;
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    next();
}

// Get all foods
router.get('/foods', async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific food
router.get('/foods/:id', getFood, (req, res) => {
    res.json(res.food);
});

// Create a food
router.post('/foods', async (req, res) => {
    const food = new Food({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        options: req.body.options,
        category: req.body.category,
        image: req.body.image
    });
    try {
        const newFood = await food.save();
        res.status(201).json(newFood);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a food
router.patch('/foods/:id', getFood, async (req, res) => {
    if (req.body.name != null) {
        res.food.name = req.body.name;
    }
    if (req.body.description != null) {
        res.food.description = req.body.description;
    }
    if (req.body.price != null) {
        res.food.price = req.body.price;
    }
    if (req.body.options != null) {
        res.food.options = req.body.options;
    }
    if (req.body.category != null) {
        res.food.category = req.body.category;
    }
    if (req.body.image != null) {
        res.food.image = req.body.image;
    }
    try {
        const updatedFood = await res.food.save();
        res.json(updatedFood);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a food
router.delete('/foods/:id', getFood, async (req, res) => {
    try {
        await res.food.remove();
        res.json({ message: 'Food deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getFood(req, res, next) {
    try {
        food = await Food.findById(req.params.id);
        if (food == null) {
            return res.status(404).json({ message: 'Cannot find food' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.food = food;
    next();
}

module.exports = router;
