const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', authorize('ADMIN', 'STAFF'), (req, res) => orderController.placeOrder(req, res));
router.get('/', authorize('ADMIN', 'STAFF'), (req, res) => orderController.getOrders(req, res));
router.get('/:id', authorize('ADMIN', 'STAFF'), (req, res) => orderController.getOrderById(req, res));

router.patch('/:id/status', authorize('ADMIN'), (req, res) => orderController.updateOrderStatus(req, res));

module.exports = router;
