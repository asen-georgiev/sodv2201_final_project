const mongoose = require('mongoose')
const Reservation = require('../models/Reservation')

const RESERVATION_TYPES = ['table', 'event']
const EVENT_TYPES = ['birthday', 'corporate', 'other']
const MENU_PREFERENCES = [
    'Regular restaurant menu',
    'Vegetarian selection',
    'Discuss a group menu',
]
const RESERVATION_STATUSES = ['pending', 'finished']
const MAX_NOTES_LENGTH = 500

function buildReservationResponse(reservation) {
    return {
        id: reservation._id.toString(),
        userId: reservation.userId.toString(),
        type: reservation.type,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        phone: reservation.phone,
        notes: reservation.notes,
        eventType: reservation.eventType,
        menuPreference: reservation.menuPreference,
        status: reservation.status,
    }
}

async function createReservation(req, res, next) {
    try {
        const {
            type,
            date,
            time,
            guests,
            phone,
            notes = '',
            eventType = null,
            menuPreference = '',
        } = req.body ?? {}

        if (
            typeof type !== 'string' ||
            typeof date !== 'string' ||
            typeof time !== 'string' ||
            typeof guests !== 'number' ||
            typeof phone !== 'string' ||
            typeof notes !== 'string' ||
            typeof menuPreference !== 'string' ||
            (eventType !== null && typeof eventType !== 'string')
        ) {
            return res.status(400).json({
                message: 'Provide valid type, date, time, guests, phone, notes, eventType, and menuPreference fields.',
            })
        }

        const normalizedPhone = phone.trim()
        const normalizedNotes = notes.trim()

        if (!RESERVATION_TYPES.includes(type)) {
            return res.status(400).json({
                message: 'Choose a table reservation or a special event.',
            })
        }

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
            !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
        ) {
            return res.status(400).json({
                message: 'Choose a valid date and time.',
            })
        }

        const bookingDate = new Date(`${date}T${time}`)

        if (
            Number.isNaN(bookingDate.getTime()) ||
            bookingDate <= new Date()
        ) {
            return res.status(400).json({
                message: 'Choose a future reservation date and time.',
            })
        }

        if (
            !Number.isInteger(guests) ||
            guests < 1 ||
            guests > 40
        ) {
            return res.status(400).json({
                message: 'Enter a guest count between 1 and 40.',
            })
        }

        if (!normalizedPhone) {
            return res.status(400).json({
                message: 'Enter a contact phone number.',
            })
        }

        if (normalizedNotes.length > MAX_NOTES_LENGTH) {
            return res.status(400).json({
                message: `Notes can be at most ${MAX_NOTES_LENGTH} characters.`,
            })
        }

        if (
            type === 'event' &&
            (!EVENT_TYPES.includes(eventType) ||
                !MENU_PREFERENCES.includes(menuPreference))
        ) {
            return res.status(400).json({
                message: 'Please complete the special event fields.',
            })
        }

        const reservation = await Reservation.create({
            userId: req.user._id,
            type,
            date,
            time,
            guests,
            phone: normalizedPhone,
            notes: normalizedNotes,
            eventType: type === 'event' ? eventType : null,
            menuPreference: type === 'event' ? menuPreference : '',
            status: 'pending',
        })

        return res.status(201).json({
            reservation: buildReservationResponse(reservation),
        })
    } catch (error) {
        next(error)
    }
}

async function getMyReservations(req, res, next) {
    try {
        const reservations = await Reservation.find({
            userId: req.user._id,
        }).sort({ date: -1, time: -1 })

        return res.status(200).json({
            reservations: reservations.map(buildReservationResponse),
        })
    } catch (error) {
        next(error)
    }
}

async function cancelReservation(req, res, next) {
    try {
        const { id } = req.params

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: 'Provide a valid reservation id.',
            })
        }

        const reservation = await Reservation.findOne({
            _id: id,
            userId: req.user._id,
        })

        if (!reservation) {
            return res.status(404).json({
                message: 'Reservation not found.',
            })
        }

        if (reservation.status === 'finished') {
            return res.status(400).json({
                message: 'Finished reservations cannot be cancelled.',
            })
        }

        await reservation.deleteOne()

        return res.status(200).json({
            message: 'Reservation cancelled successfully.',
        })
    } catch (error) {
        next(error)
    }
}

async function getAllReservations(req, res, next) {
    try {
        const reservations = await Reservation.find().sort({ date: -1, time: -1 })

        return res.status(200).json({
            reservations: reservations.map(buildReservationResponse),
        })
    } catch (error) {
        next(error)
    }
}

async function updateReservationStatus(req, res, next) {
    try {
        const { id } = req.params
        const { status } = req.body ?? {}

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: 'Provide a valid reservation id.',
            })
        }

        if (!RESERVATION_STATUSES.includes(status)) {
            return res.status(400).json({
                message: 'Status must be pending or finished.',
            })
        }

        const reservation = await Reservation.findById(id)

        if (!reservation) {
            return res.status(404).json({
                message: 'Reservation not found.',
            })
        }

        reservation.status = status

        await reservation.save()

        return res.status(200).json({
            reservation: buildReservationResponse(reservation),
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createReservation,
    getMyReservations,
    cancelReservation,
    getAllReservations,
    updateReservationStatus,
}
