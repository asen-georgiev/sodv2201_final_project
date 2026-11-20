const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        type: {
            type: String,
            enum: ['table', 'event'],
            required: true,
        },

        date: {
            type: String,
            required: true,
            match: /^\d{4}-\d{2}-\d{2}$/,
        },

        time: {
            type: String,
            required: true,
            match: /^([01]\d|2[0-3]):[0-5]\d$/,
        },

        guests: {
            type: Number,
            required: true,
            min: 1,
            max: 40,
            validate: {
                validator: Number.isInteger,
                message: 'Guest count must be a whole number.',
            },
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        notes: {
            type: String,
            trim: true,
            default: '',
        },

        eventType: {
            type: String,
            enum: ['birthday', 'corporate', 'other', null],
            default: null,
            required: function () {
                return this.type === 'event'
            },
        },

        menuPreference: {
            type: String,
            trim: true,
            default: '',
            required: function () {
                return this.type === 'event'
            },
            validate: {
                validator: function (value) {
                    if (this.type === 'table') {
                        return value === ''
                    }

                    return [
                        'Regular restaurant menu',
                        'Vegetarian selection',
                        'Discuss a group menu',
                    ].includes(value)
                },
                message: 'Choose a valid menu preference for the reservation type.',
            },
        },

        status: {
            type: String,
            enum: ['pending', 'finished'],
            default: 'pending',
            required: true,
        },
    },
    {
        collection: 'reservations',
    },
)

reservationSchema.pre('validate', function () {
    if (this.type === 'table') {
        this.eventType = null
        this.menuPreference = ''
    }
})

module.exports = mongoose.model('Reservation', reservationSchema)
