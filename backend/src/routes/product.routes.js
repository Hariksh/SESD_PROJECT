const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// Bind methods to controller instance to maintain 'this' context
router.get('/', protect, (req, res) => productController.getAllProducts(req, res));
router.post('/', protect, admin, (req, res) => productController.createProduct(req, res));
router.patch('/:id/stock', protect, (req, res) => productController.updateStock(req, res));

module.exports = router;
