const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
        type: String,
        required: true,
    },
    version: {
        type: Number,
        default: 1,
    },
}, {
    timestamps: true,
});

// Middleware to increment version on update for optimistic locking
productSchema.pre('save', function (next) {
    if (this.isModified('stock')) {
        this.version += 1;
    }
    next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
