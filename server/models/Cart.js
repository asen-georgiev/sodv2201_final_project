const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema(
    {
        menuItemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem',
            required: true,
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

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },

        items: {
            type: [cartItemSchema],
            default: [],
            validate: {
                validator: items => {
                    if (!Array.isArray(items)) return false

                    const ids = items.map(item => String(item.menuItemId))

                    return new Set(ids).size === ids.length
                },
                message: 'A dish can appear only once in a cart. Update its quantity instead.',
            },
        },
    },
    {
        collection: 'carts',
    },
)

module.exports = mongoose.model('Cart', cartSchema)
