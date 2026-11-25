const express = require('express')

const {
    createReservation,
    getMyReservations,
    updateReservation,
    cancelReservation,
    getAllReservations,
    updateReservationStatus,
} = require('../controllers/reservationsController')

const {
    requireAuth,
    requireAdmin,
    requireCustomer,
} = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/', requireAuth, requireCustomer, createReservation)
router.get('/me', requireAuth, requireCustomer, getMyReservations)
router.patch('/:id', requireAuth, requireCustomer, updateReservation)
router.delete('/:id', requireAuth, requireCustomer, cancelReservation)
router.get('/', requireAuth, requireAdmin, getAllReservations)
router.patch('/:id/status', requireAuth, requireAdmin, updateReservationStatus)

module.exports = router
