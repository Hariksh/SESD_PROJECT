const Product = require('../models/product.model');
const { Order } = require('../models/order.model');
const Category = require('../models/category.model');
const BaseService = require('../core/base.service');

class AnalyticsService extends BaseService {
    async getDashboardStats() {
        const productStats = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalProducts: { $sum: 1 },
                    totalStock: { $sum: '$stock' },
                    lowStockItems: {
                        $sum: {
                            $cond: [
                                { $and: [{ $lt: ['$stock', 10] }, { $gt: ['$stock', 0] }] },
                                1, 0
                            ]
                        }
                    },
                    outOfStockItems: {
                        $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] }
                    }
                }
            }
        ]);

        const categoryDistribution = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    productCount: { $sum: 1 },
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryDetail'
                }
            },
            { $unwind: '$categoryDetail' },
            {
                $project: {
                    name: '$categoryDetail.name',
                    value: '$productCount'
                }
            }
        ]);

        // Generate last 7 days of dates for a truly dynamic feel even with no data
        const dates = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        const revenueData = await Order.aggregate([
            { $match: { status: { $ne: 'CANCELLED' } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$totalAmount" }
                }
            }
        ]);

        const revenueTrends = dates.map(date => {
            const match = revenueData.find(r => r._id === date);
            return { date, revenue: match ? match.revenue : 0 };
        });

        return {
            summary: productStats[0] || { totalProducts: 0, totalStock: 0, lowStockItems: 0, outOfStockItems: 0 },
            categoryDistribution,
            revenueTrends
        };
    }
}

module.exports = new AnalyticsService();
