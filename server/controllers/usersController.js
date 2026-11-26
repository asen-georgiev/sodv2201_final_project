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
        const { name, phone } = req.body ?? {}

        if (
            name === undefined &&
            phone === undefined
        ) {
            return res.status(400).json({
                message: 'Provide name or phone to update.',
            })
        }

        if (
            name !== undefined &&
            (typeof name !== 'string' || !name.trim())
        ) {
            return res.status(400).json({
                message: 'Provide a valid name.',
            })
        }

        if (
            phone !== undefined &&
            typeof phone !== 'string'
        ) {
            return res.status(400).json({
                message: 'Provide a valid phone number.',
            })
        }

        const user = req.user

        if (name !== undefined) {
            user.name = name.trim()
        }

        if (phone !== undefined) {
            user.phone = phone.trim()
        }

        await user.save()

        return res.status(200).json({
            user: buildUserResponse(user),
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    updateMyProfile,
}