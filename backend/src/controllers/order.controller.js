const BaseController = require('../core/base.controller');
const orderService = require('../services/order.service');

class OrderController extends BaseController {
    async placeOrder(req, res) {
        try {
            const order = await orderService.placeOrder(req.user._id, req.body.items);
            return this.sendSuccess(res, order, 'Order placed successfully', 201);
        } catch (error) {
            if (error.message.includes('Conflict')) {
                return this.sendError(res, error.message, 409);
            }
            return this.sendError(res, error.message, 400);
        }
    }

    async getOrders(req, res) {
        try {
            // Admin sees all orders, Staff sees only their own
            const userId = req.user.role === 'ADMIN' ? null : req.user._id;
            const orders = await orderService.getOrders(userId);
            return this.sendSuccess(res, orders);
        } catch (error) {
            return this.sendError(res, error.message);
        }
    }

    async getOrderById(req, res) {
        try {
            const order = await orderService.getOrderById(req.params.id);

            // Staff can only view their own orders
            if (req.user.role !== 'ADMIN' && order.user._id.toString() !== req.user._id.toString()) {
                return this.sendError(res, 'Not authorized to view this order', 403);
            }

            return this.sendSuccess(res, order);
        } catch (error) {
            return this.sendError(res, error.message, 404);
        }
    }

    async updateOrderStatus(req, res) {
        try {
            const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
            return this.sendSuccess(res, order, `Order status updated to ${req.body.status}`);
        } catch (error) {
            return this.sendError(res, error.message, 400);
        }
    }
}

module.exports = new OrderController();
