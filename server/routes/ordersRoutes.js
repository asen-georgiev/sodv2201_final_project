const express = require('express')

const {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
} = require('../controllers/ordersController')

const {
    requireAuth,
    requireAdmin,
    requireCustomer,
} = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/', requireAuth, requireCustomer, createOrder)
router.get('/me', requireAuth, requireCustomer, getMyOrders)
router.get('/', requireAuth, requireAdmin, getAllOrders)
router.get('/:id', requireAuth, getOrderById)
router.patch('/:id/status', requireAuth, requireAdmin, updateOrderStatus)

module.exports = router
