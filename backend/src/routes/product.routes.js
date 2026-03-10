const express = require('express');
const router = express.Router();
const inventoryService = require('../services/inventory.service');
const { protect, admin } = require('../middleware/auth.middleware');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public/Auth
router.get('/', protect, async (req, res) => {
    try {
        const products = await inventoryService.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const product = await inventoryService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update stock atomically
// @route   PATCH /api/products/:id/stock
// @access  Private/Staff/Admin
router.patch('/:id/stock', protect, async (req, res) => {
    const { quantity, version } = req.body;
    try {
        const updatedProduct = await inventoryService.updateStockAtomic(req.params.id, quantity, version);
        res.json(updatedProduct);
    } catch (error) {
        if (error.message.includes('Conflict')) {
            res.status(409).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
});

module.exports = router;
