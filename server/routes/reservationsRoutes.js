const express = require('express')

const {
    createReservation,
    getMyReservations,
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
router.delete('/:id', requireAuth, requireCustomer, cancelReservation)
router.get('/', requireAuth, requireAdmin, getAllReservations)
router.patch('/:id/status', requireAuth, requireAdmin, updateReservationStatus)

module.exports = router
