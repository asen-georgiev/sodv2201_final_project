const express = require('express')

const {
    getCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart,
} = require('../controllers/cartController')

const {
    requireAuth,
    requireCustomer,
} = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/', requireAuth, requireCustomer, getCart)
router.post('/items', requireAuth, requireCustomer, addCartItem)
router.patch('/items/:menuItemId', requireAuth, requireCustomer, updateCartItem)
router.delete('/items/:menuItemId', requireAuth, requireCustomer, removeCartItem)
router.delete('/', requireAuth, requireCustomer, clearCart)

module.exports = router
