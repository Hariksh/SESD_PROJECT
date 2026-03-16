const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
router.get('/', (req, res) => productController.getAllProducts(req, res));
router.post('/', (req, res) => productController.createProduct(req, res));
router.patch('/:id/stock', (req, res) => productController.updateStock(req, res));

module.exports = router;
