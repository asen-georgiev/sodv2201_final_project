const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },

        phone: {
            type: String,
            trim: true,
            default: '',
        },

        role: {
            type: String,
            enum: ['customer', 'admin'],
            default: 'customer',
            required: true,
        },

        passwordHash: {
            type: String,
            required: true,
            select: false,
        },
    },
    {
        collection: 'users',
    },
)

module.exports = mongoose.model('User', userSchema)
