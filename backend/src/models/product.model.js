const mongoose = require('mongoose');

class ProductSchema {
    static create() {
        const schema = new mongoose.Schema({
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
            },
            price: {
                type: Number,
                required: true,
                default: 0,
            },
            stock: {
                type: Number,
                required: true,
                default: 0,
            },
            lowStockThreshold: {
                type: Number,
                default: 10,
            },
            category: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category',
                required: true,
            },
            version: {
                type: Number,
                default: 1,
            },
        }, {
            timestamps: true,
        });

        schema.pre('save', function () {
            if (this.isModified('stock')) {
                this.version += 1;
            }
        });

        /**
         * isAvailable(qty) — checks if sufficient stock exists for a given quantity.
         * Defined per class diagram: Product +isAvailable(int qty)
         */
        schema.methods.isAvailable = function (qty) {
            return this.stock >= qty;
        };

        /**
         * isLowStock() — returns true if stock is at or below the lowStockThreshold.
         */
        schema.methods.isLowStock = function () {
            return this.stock <= this.lowStockThreshold && this.stock > 0;
        };

        return schema;
    }
}

const Product = mongoose.model('Product', ProductSchema.create());
module.exports = Product;
