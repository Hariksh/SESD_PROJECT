const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// Staff or Admin can place and view orders
router.post('/', authorize('ADMIN', 'STAFF'), (req, res) => orderController.placeOrder(req, res));
router.get('/', authorize('ADMIN', 'STAFF'), (req, res) => orderController.getOrders(req, res));
router.get('/:id', authorize('ADMIN', 'STAFF'), (req, res) => orderController.getOrderById(req, res));

// Only ADMIN can update order status
router.patch('/:id/status', authorize('ADMIN'), (req, res) => orderController.updateOrderStatus(req, res));

module.exports = router;
