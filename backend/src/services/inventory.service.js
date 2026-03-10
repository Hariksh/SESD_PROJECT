const Product = require('../models/product.model');

class InventoryService {
    async getAllProducts() {
        return await Product.find({});
    }

    async getProductById(id) {
        return await Product.findById(id);
    }

    async createProduct(productData) {
        const product = new Product(productData);
        return await product.save();
    }

    async updateProduct(id, productData) {
        const product = await Product.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }

        // Apply updates
        Object.assign(product, productData);
        return await product.save();
    }

    async updateStockAtomic(id, quantity, expectedVersion) {
        // This implements optimistic locking
        const product = await Product.findOneAndUpdate(
            { _id: id, version: expectedVersion },
            {
                $inc: { stock: quantity },
                $set: { version: expectedVersion + 1 }
            },
            { new: true }
        );

        if (!product) {
            // Check if product exists but version mismatched
            const exists = await Product.findById(id);
            if (!exists) throw new Error('Product not found');
            throw new Error('Conflict: Product was updated by another process. Please retry.');
        }

        return product;
    }

    async deleteProduct(id) {
        const product = await Product.findById(id);
        if (product) {
            await product.deleteOne();
            return true;
        }
        throw new Error('Product not found');
    }
}

module.exports = new InventoryService();
