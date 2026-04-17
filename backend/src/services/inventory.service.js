const Product = require('../models/product.model');
const StockLog = require('../models/stockLog.model');
const BaseService = require('../core/base.service');

class InventoryService extends BaseService {
    constructor() {
        super(Product);
    }

    async getAll() {
        return await this.model.find({}).populate('category', 'name');
    }

    async getById(id) {
        return await this.model.findById(id).populate('category', 'name');
    }

    async updateStockAtomic(id, quantity, expectedVersion) {
        const product = await this.model.findOneAndUpdate(
            { _id: id, version: expectedVersion },
            {
                $inc: { stock: quantity },
                $set: { version: expectedVersion + 1 }
            },
            { new: true }
        );

        if (!product) {
            const exists = await this.model.findById(id);
            if (!exists) throw new Error('Product not found');
            throw new Error('Conflict: Product was updated by another process. Please retry.');
        }

        await StockLog.create({
            product: product._id,
            quantityChanged: quantity,
            changeType: quantity > 0 ? 'RESTOCK' : 'DEDUCT',
        });

        // Low-stock threshold alert (idea.md: "Auto-alerts when stock dips below threshold")
        if (product.isLowStock()) {
            console.warn(
                `[LOW STOCK ALERT] Product "${product.name}" (ID: ${product._id}) ` +
                `has only ${product.stock} units left (threshold: ${product.lowStockThreshold}).`
            );
            product._lowStockAlert = true;
        }

        return product;
    }

    async getStockLogs(productId) {
        return await StockLog.find({ product: productId })
            .populate('order', 'status totalAmount')
            .sort({ createdAt: -1 });
    }
}

module.exports = new InventoryService();
