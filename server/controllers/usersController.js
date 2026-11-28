const mongoose = require('mongoose')
const User = require('../models/User')

function buildUserResponse(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
    }
}

async function getAllUsers(req, res, next) {
    try {
        const users = await User.find()

        return res.status(200).json({
            users: users.map(buildUserResponse),
        })
    } catch (error) {
        next(error)
    }
}

async function getUserById(req, res, next) {
    try {
        const { id } = req.params

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: 'Provide a valid user id.',
            })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
            })
        }

        return res.status(200).json({
            user: buildUserResponse(user),
        })
    } catch (error) {
        next(error)
    }
}

async function updateMyProfile(req, res, next) {
    try {
        const { name, phone, email } = req.body ?? {}

        if (name === undefined && phone === undefined && email === undefined) {
            return res.status(400).json({
                message: 'Provide name, phone, or email to update.',
            })
        }

        if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
            return res.status(400).json({
                message: 'Provide a valid name.',
            })
        }

        if (phone !== undefined && typeof phone !== 'string') {
            return res.status(400).json({
                message: 'Provide a valid phone number.',
            })
        }
        if (email !== undefined && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) {
            return res.status(400).json({
                message: 'Provide a valid email address.',
            })
        }
        const user = req.user

        if (name !== undefined) {
            user.name = name.trim()
        }

        if (phone !== undefined) {
            user.phone = phone.trim()
        }
        if (email !== undefined) {
            user.email = email.trim().toLowerCase()
        }
        await user.save()

        return res.status(200).json({
            user: buildUserResponse(user),
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Email is already in use.',
            })
        }
        next(error)
    }
}
async function updateCustomer(req, res, next) {
    try {
        const { id } = req.params
        const { name, email } = req.body ?? {}

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: 'Provide a valid user id.',
            })
        }

        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                message: 'Provide a valid name.',
            })
        }

        if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return res.status(400).json({
                message: 'Provide a valid email address.',
            })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
            })
        }

        if (user.role !== 'customer') {
            return res.status(403).json({
                message: 'Only customer accounts can be edited.',
            })
        }

        user.name = name.trim()
        user.email = email.trim().toLowerCase()

        await user.save()

        return res.status(200).json({
            user: buildUserResponse(user),
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Email is already in use.',
            })
        }

        next(error)
    }
}
async function deleteCustomer(req, res, next) {
    try {
        const { id } = req.params

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: 'Provide a valid user id.',
            })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
            })
        }

        if (user.role !== 'customer') {
            return res.status(403).json({
                message: 'Administrator accounts cannot be deleted.',
            })
        }

        await user.deleteOne()

        return res.status(200).json({
            message: 'Customer deleted successfully.',
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    updateMyProfile,
    updateCustomer,
    deleteCustomer,
}
