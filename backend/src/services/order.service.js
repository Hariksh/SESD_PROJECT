const { Order, OrderSchema } = require('../models/order.model');
const Product = require('../models/product.model');
const StockLog = require('../models/stockLog.model');
const BaseService = require('../core/base.service');

class OrderService extends BaseService {
    async placeOrder(userId, items) {
        if (!items || items.length === 0) {
            throw new Error('Order must have at least one item');
        }

        const orderItems = [];
        const stockLogs = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                throw new Error(`Product not found: ${item.productId}`);
            }

            if (product.stock < item.quantity) {
                throw new Error(
                    `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`
                );
            }

            const updated = await Product.findOneAndUpdate(
                { _id: product._id, version: product.version },
                {
                    $inc: { stock: -item.quantity },
                    $set: { version: product.version + 1 },
                },
                { new: true }
            );

            if (!updated) {
                throw new Error(
                    `Conflict: Stock for "${product.name}" was modified by another process. Please retry.`
                );
            }

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                unitPrice: product.price,
            });

            stockLogs.push({
                product: product._id,
                quantityChanged: -item.quantity,
                changeType: 'DEDUCT',
            });
        }

        const order = new Order({
            user: userId,
            items: orderItems,
        });
        order.calculateTotal();
        await order.save();

        for (const log of stockLogs) {
            log.order = order._id;
            await StockLog.create(log);
        }

        return order;
    }

    async getOrders(userId = null) {
        const filter = userId ? { user: userId } : {};
        return await Order.find(filter)
            .populate('user', 'name email role')
            .populate('items.product', 'name price')
            .sort({ createdAt: -1 });
    }

    async getOrderById(orderId) {
        const order = await Order.findById(orderId)
            .populate('user', 'name email role')
            .populate('items.product', 'name price');

        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }

    async updateOrderStatus(orderId, newStatus) {
        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        if (!order.canTransitionTo(newStatus)) {
            const allowed = OrderSchema.VALID_TRANSITIONS[order.status];
            throw new Error(
                `Invalid transition: Cannot move from "${order.status}" to "${newStatus}". Allowed: ${allowed.length > 0 ? allowed.join(', ') : 'none (terminal state)'}`
            );
        }

        if (newStatus === 'CANCELLED') {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: item.quantity },
                });

                await StockLog.create({
                    product: item.product,
                    order: order._id,
                    quantityChanged: item.quantity,
                    changeType: 'RESTOCK',
                });
            }
        }

        order.status = newStatus;
        await order.save();
        return order;
    }
}

module.exports = new OrderService();
