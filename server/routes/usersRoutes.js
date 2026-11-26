const express = require('express')

const {
    getAllUsers,
    getUserById,
    updateMyProfile,
} = require('../controllers/usersController')

const {
    requireAuth,
    requireAdmin,
} = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/', requireAuth, requireAdmin, getAllUsers)

router.patch('/me', requireAuth, updateMyProfile)

router.get('/:id', requireAuth, requireAdmin, getUserById)

module.exports = router