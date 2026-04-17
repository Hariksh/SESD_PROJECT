const mongoose = require('mongoose');

class OrderItemSchema {
    static create() {
        return new mongoose.Schema({
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            unitPrice: {
                type: Number,
                required: true,
                min: 0,
            },
        });
    }
}

class OrderSchema {
    static VALID_TRANSITIONS = {
        PENDING: ['CONFIRMED', 'CANCELLED'],
        CONFIRMED: ['SHIPPED', 'CANCELLED'],
        SHIPPED: ['DELIVERED'],
        DELIVERED: [],
        CANCELLED: [],
    };

    static create() {
        const orderItemSchema = OrderItemSchema.create();

        const schema = new mongoose.Schema({
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            items: {
                type: [orderItemSchema],
                required: true,
                validate: {
                    validator: (items) => items.length > 0,
                    message: 'Order must have at least one item',
                },
            },
            totalAmount: {
                type: Number,
                required: true,
                default: 0,
                min: 0,
            },
            status: {
                type: String,
                enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
                default: 'PENDING',
            },
            deliveryLocation: {
                address: { type: String },
                city: { type: String },
                postalCode: { type: String },
            },
        }, {
            timestamps: true,
        });

        schema.methods.canTransitionTo = function (newStatus) {
            const allowed = OrderSchema.VALID_TRANSITIONS[this.status];
            return allowed && allowed.includes(newStatus);
        };

        schema.methods.calculateTotal = function () {
            this.totalAmount = this.items.reduce(
                (sum, item) => sum + (item.quantity * item.unitPrice), 0
            );
            return this.totalAmount;
        };

        /**
         * addLocation(location) — attaches delivery location metadata to the order.
         * Defined per class diagram: Order +addLocation()
         * @param {Object} location - e.g. { address, city, postalCode }
         */
        schema.methods.addLocation = function (location) {
            this.deliveryLocation = location;
            return this;
        };

        return schema;
    }
}

const Order = mongoose.model('Order', OrderSchema.create());
module.exports = { Order, OrderSchema };