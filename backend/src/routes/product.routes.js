const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// Any authenticated user can view products
router.get('/', (req, res) => productController.getAllProducts(req, res));
router.get('/:id', (req, res) => productController.getProductById(req, res));

// Stock logs for a product (audit trail)
router.get('/:id/logs', (req, res) => productController.getStockLogs(req, res));

// Only ADMIN can create, update, delete products
router.post('/', authorize('ADMIN'), (req, res) => productController.createProduct(req, res));
router.put('/:id', authorize('ADMIN'), (req, res) => productController.updateProduct(req, res));
router.delete('/:id', authorize('ADMIN'), (req, res) => productController.deleteProduct(req, res));

// STAFF or ADMIN can update stock
router.patch('/:id/stock', authorize('ADMIN', 'STAFF'), (req, res) => productController.updateStock(req, res));

module.exports = router;
