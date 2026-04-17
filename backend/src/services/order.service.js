const { Order, OrderSchema } = require('../models/order.model');
const Product = require('../models/product.model');
const StockLog = require('../models/stockLog.model');
const BaseService = require('../core/base.service');
const mongoose = require('mongoose');

class OrderService extends BaseService {
    constructor() {
        super(Order);
    }
    async placeOrder(userId, items, location = null) {
        if (!items || items.length === 0) {
            throw new Error('Order must have at least one item');
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const orderItems = [];
            const stockLogs = [];

            for (const item of items) {
                const product = await Product.findById(item.productId).session(session);
                if (!product) {
                    throw new Error(`Product not found: ${item.productId}`);
                }

                // Use model method isAvailable() as per class diagram
                if (!product.isAvailable(item.quantity)) {
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
                    { new: true, session }
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

            // Use model method addLocation() as per class diagram
            if (location) {
                order.addLocation(location);
            }

            await order.save({ session });

            for (const log of stockLogs) {
                log.order = order._id;
                await StockLog.create([log], { session });
            }

            await session.commitTransaction();
            session.endSession();
            
            return order;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
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
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const order = await Order.findById(orderId).session(session);
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
                    }, { session });

                    await StockLog.create([{
                        product: item.product,
                        order: order._id,
                        quantityChanged: item.quantity,
                        changeType: 'RESTOCK',
                    }], { session });
                }
            }

            order.status = newStatus;
            await order.save({ session });
            
            await session.commitTransaction();
            session.endSession();
            
            return order;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
}

module.exports = new OrderService();
