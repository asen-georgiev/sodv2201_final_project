const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters.')
}

const COOKIE_NAME = 'authToken'

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api',
}

function publicUser(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
    }
}

function setAuthCookie(res, user) {
    const token = jwt.sign(
        { userId: user._id.toString() },
        JWT_SECRET,
        {
            algorithm: 'HS256',
            expiresIn: '1d',
        },
    )

    res.cookie(COOKIE_NAME, token, {
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000,
    })
}

async function register(req, res, next) {
    try {
        const {
            name,
            email,
            password,
            phone = '',
        } = req.body ?? {}

        if (
            typeof name !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            typeof phone !== 'string'
        ) {
            return res.status(400).json({
                message: 'Provide valid name, email, password, and phone fields.',
            })
        }

        const normalizedName = name.trim()
        const normalizedEmail = email.trim().toLowerCase()

        if (!normalizedName) {
            return res.status(400).json({
                message: 'Name is required.',
            })
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({
                message: 'Enter a valid email address.',
            })
        }

        if (
            password.length < 8 ||
            Buffer.byteLength(password, 'utf8') > 72
        ) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters and at most 72 bytes.',
            })
        }

        const existingUser = await User.findOne({
            email: normalizedEmail,
        })

        if (existingUser) {
            return res.status(409).json({
                message: 'An account with this email already exists.',
            })
        }

        const passwordHash = await bcrypt.hash(password, 12)

        const user = await User.create({
            name: normalizedName,
            email: normalizedEmail,
            phone: phone.trim(),
            passwordHash,
            role: 'customer',
        })

        setAuthCookie(res, user)

        return res.status(201).json({
            user: publicUser(user),
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'An account with this email already exists.',
            })
        }
        next(error)
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body ?? {}

        if (
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: 'Email and password are required.',
            })
        }

        if (Buffer.byteLength(password, 'utf8') > 72) {
            return res.status(401).json({
                message: 'Invalid email or password.',
            })
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        }).select('+passwordHash')

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password.',
            })
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.passwordHash,
        )

        if (!passwordMatches) {
            return res.status(401).json({
                message: 'Invalid email or password.',
            })
        }

        setAuthCookie(res, user)

        return res.status(200).json({
            user: publicUser(user),
        })
    } catch (error) {
        next(error)
    }
}

function logout(req, res) {
    res.clearCookie(COOKIE_NAME, cookieOptions)

    return res.status(200).json({
        message: 'Logged out successfully.',
    })
}

function getCurrentUser(req, res) {
    if (!req.user) {
        return res.status(401).json({
            message: 'Authentication required.',
        })
    }
    return res.status(200).json({
        user: publicUser(req.user),
    })
}

module.exports = {
    register,
    login,
    logout,
    getCurrentUser,
}
