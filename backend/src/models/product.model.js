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

        return schema;
    }
}

const Product = mongoose.model('Product', ProductSchema.create());
module.exports = Product;
