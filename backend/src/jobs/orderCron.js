const cron = require('node-cron');
const { Order } = require('../models/order.model');
const orderService = require('../services/order.service');

class OrderCronJob {
    static init() {
        // Run every minute (or change to everyday depending on req) checking for pendings
        // Using every hour as a standard: '0 * * * *'
        // For testing purposes during dev, we can use every 15 minutes: '*/15 * * * *'
        cron.schedule('*/15 * * * *', async () => {
            console.log('[Cron] Running Auto-expire pending orders job...');
            try {
                // Find threshold: e.g., orders pending for more than 24 hours
                const expirationThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000); 

                const expiredOrders = await Order.find({
                    status: 'PENDING',
                    createdAt: { $lt: expirationThreshold }
                });

                if (expiredOrders.length > 0) {
                    console.log(`[Cron] Found ${expiredOrders.length} pending orders to expire. Setting to CANCELLED.`);
                    
                    for (const order of expiredOrders) {
                        try {
                            await orderService.updateOrderStatus(order._id, 'CANCELLED');
                            console.log(`[Cron] Successfully cancelled order ${order._id}`);
                        } catch (err) {
                            console.error(`[Cron] Error cancelling order ${order._id}:`, err);
                        }
                    }
                } else {
                    console.log('[Cron] No expired pending orders found.');
                }
            } catch (error) {
                console.error('[Cron] Error running auto-expire job:', error);
            }
        });
    }
}

module.exports = OrderCronJob;
