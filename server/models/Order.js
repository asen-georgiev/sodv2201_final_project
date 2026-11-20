const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema(
    {
        menuItemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem',
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0.01,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: 'Quantity must be a whole number.',
            },
        },
    },
    {
        _id: false,
    },
)

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        items: {
            type: [orderItemSchema],
            default: [],
            validate: {
                validator: items => Array.isArray(items) && items.length > 0,
                message: 'An order must contain at least one item.',
            },
        },

        fulfillmentType: {
            type: String,
            enum: ['pickup', 'delivery'],
            required: true,
        },

        deliveryAddress: {
            type: String,
            trim: true,
            default: '',
            required: function () {
                return this.fulfillmentType === 'delivery'
            },
        },

        notes: {
            type: String,
            trim: true,
            default: '',
        },

        total: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: ['pending', 'finished'],
            default: 'pending',
            required: true,
        },

        createdAt: {
            type: Date,
            default: Date.now,
            required: true,
        },
    },
    {
        collection: 'orders',
    },
)

module.exports = mongoose.model('Order', orderSchema)
