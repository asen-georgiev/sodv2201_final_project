const mongoose = require('mongoose')

const menuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0.01,
        },

        imageUrl: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            enum: ['starters', 'mains', 'desserts', 'beverages'],
        },

        ingredients: {
            type: [
                {
                    type: String,
                    required: true,
                    trim: true,
                },
            ],
            validate: {
                validator: ingredients => ingredients.length > 0,
                message: 'At least one ingredient is required.',
            },
            default: [],
        },

        dietaryOptions: {
            type: [
                {
                    type: String,
                    enum: ['vegetarian', 'gluten-free'],
                },
            ],
            default: [],
        },

        isAvailable: {
            type: Boolean,
            default: true,
        },

        isPopular: {
            type: Boolean,
            default: false,
        },
    },
    {
        collection: 'menuitems',
    },
)

module.exports = mongoose.model('MenuItem', menuItemSchema)
