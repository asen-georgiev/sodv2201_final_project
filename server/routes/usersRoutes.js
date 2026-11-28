const express = require('express')

const {
    getAllUsers,
    getUserById,
    updateMyProfile,
    updateCustomer,
    deleteCustomer,
} = require('../controllers/usersController')

const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/', requireAuth, requireAdmin, getAllUsers)

router.patch('/me', requireAuth, updateMyProfile)

router.get('/:id', requireAuth, requireAdmin, getUserById)
router.patch('/:id', requireAuth, requireAdmin, updateCustomer)

router.delete('/:id', requireAuth, requireAdmin, deleteCustomer)

module.exports = router
