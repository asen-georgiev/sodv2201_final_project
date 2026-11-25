const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters.')
}

async function requireAuth(req, res, next) {
    const token = req.cookies?.authToken

    if (!token || typeof token !== 'string') {
        return res.status(401).json({
            message: 'Authentication required.',
        })
    }

    let payload

    try {
        payload = jwt.verify(token, JWT_SECRET, {
            algorithms: ['HS256'],
        })
    } catch {
        return res.status(401).json({
            message: 'Invalid or expired authentication token.',
        })
    }

    if (
        typeof payload !== 'object' ||
        payload === null ||
        !mongoose.isObjectIdOrHexString(payload.userId)
    ) {
        return res.status(401).json({
            message: 'Invalid authentication token.',
        })
    }

    try {
        const user = await User.findById(payload.userId)

        if (!user) {
            return res.status(401).json({
                message: 'This account no longer exists.',
            })
        }

        req.user = user

        next()
    } catch (error) {
        next(error)
    }
}

function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            message: 'Authentication required.',
        })
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            message: 'Administrator access required.',
        })
    }

    next()
}

function requireCustomer(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            message: 'Authentication required.',
        })
    }

    if (req.user.role !== 'customer') {
        return res.status(403).json({
            message: 'Customer access required.',
        })
    }

    next()
}

module.exports = {
    requireAuth,
    requireAdmin,
    requireCustomer,
}
