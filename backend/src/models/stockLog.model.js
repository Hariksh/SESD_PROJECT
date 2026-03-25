const mongoose = require('mongoose');

class StockLogSchema {
    static create() {
        const schema = new mongoose.Schema({
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            order: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order',
                default: null,
            },
            quantityChanged: {
                type: Number,
                required: true,
            },
            changeType: {
                type: String,
                enum: ['DEDUCT', 'RESTOCK'],
                required: true,
            },
        }, {
            timestamps: true,
        });

        return schema;
    }
}

const StockLog = mongoose.model('StockLog', StockLogSchema.create());
module.exports = StockLog;
