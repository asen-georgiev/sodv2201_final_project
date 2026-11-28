const express = require('express')

const {
    getMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
} = require('../controllers/menuController')

const {
    requireAuth,
    requireAdmin,
} = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/', getMenuItems)
router.get('/:id', getMenuItemById)
router.post('/', requireAuth, requireAdmin, createMenuItem)
router.patch('/:id', requireAuth, requireAdmin, updateMenuItem)
router.delete('/:id', requireAuth, requireAdmin, deleteMenuItem)

module.exports = router
