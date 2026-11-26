const mongoose = require('mongoose')
const Cart = require('../models/Cart')
const MenuItem = require('../models/MenuItem')
const Order = require('../models/Order')

const FULFILLMENT_TYPES = ['pickup', 'delivery']
const ORDER_STATUSES = ['pending', 'finished']
const MAX_NOTES_LENGTH = 500

function purchasedItem(dish, quantity) {
    return {
        menuItemId: dish._id,
        name: dish.name,
        price: dish.price,
        quantity,
    }
}

function calculateTotal(items) {
    return Number(
        items
            .reduce((sum, item) => sum + item.price * item.quantity, 0)
            .toFixed(2),
    )
}

function buildOrderResponse(order) {
    return {
        id: order._id.toString(),
        userId: order.userId.toString(),
        items: order.items.map(item => ({
            menuItemId: item.menuItemId.toString(),
            name: item.name,
            price: item.price,
            quantity: item.quantity,
        })),
        fulfillmentType: order.fulfillmentType,
        deliveryAddress: order.deliveryAddress,
        notes: order.notes,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
    }
}

async function createOrder(req, res, next) {
    try {
        const {
            fulfillmentType,
            deliveryAddress = '',
            notes = '',
        } = req.body ?? {}

        if (
            typeof fulfillmentType !== 'string' ||
            typeof deliveryAddress !== 'string' ||
            typeof notes !== 'string'
        ) {
            return res.status(400).json({
                message: 'Provide valid fulfillmentType, deliveryAddress, and notes fields.',
            })
        }

        const normalizedAddress = deliveryAddress.trim()
        const normalizedNotes = notes.trim()

        if (!FULFILLMENT_TYPES.includes(fulfillmentType)) {
            return res.status(400).json({
                message: 'Choose pickup or delivery.',
            })
        }

        if (fulfillmentType === 'delivery' && !normalizedAddress) {
            return res.status(400).json({
                message: 'Enter a delivery address.',
            })
        }

        if (normalizedNotes.length > MAX_NOTES_LENGTH) {
            return res.status(400).json({
                message: `Notes can be at most ${MAX_NOTES_LENGTH} characters.`,
            })
        }

        const cart = await Cart.findOne({
            userId: req.user._id,
        })

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: 'Your cart is empty.',
            })
        }

        const dishes = await MenuItem.find({
            _id: { $in: cart.items.map(item => item.menuItemId) },
        })

        const items = []

        for (const cartItem of cart.items) {
            const dish = dishes.find(menuItem =>
                menuItem._id.equals(cartItem.menuItemId),
            )

            if (!dish || !dish.isAvailable) {
                return res.status(400).json({
                    message: 'Some items are no longer available. Remove them before checkout.',
                })
            }

            items.push(purchasedItem(dish, cartItem.quantity))
        }

        const order = await mongoose.connection.transaction(async session => {
            const [createdOrder] = await Order.create(
                [
                    {
                        userId: req.user._id,
                        items,
                        fulfillmentType,
                        deliveryAddress:
                            fulfillmentType === 'delivery' ? normalizedAddress : '',
                        notes: normalizedNotes,
                        total: calculateTotal(items),
                        status: 'pending',
                    },
                ],
                { session },
            )

            cart.items = []

            await cart.save({ session })

            return createdOrder
        })

        return res.status(201).json({
            order: buildOrderResponse(order),
        })
    } catch (error) {
        next(error)
    }
}

async function getMyOrders(req, res, next) {
    try {
        const orders = await Order.find({
            userId: req.user._id,
        }).sort({ createdAt: -1 })

        return res.status(200).json({
            orders: orders.map(buildOrderResponse),
        })
    } catch (error) {
        next(error)
    }
}

async function getOrderById(req, res, next) {
    try {
        const { id } = req.params

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: 'Provide a valid order id.',
            })
        }

        const order = await Order.findById(id)

        if (!order) {
            return res.status(404).json({
                message: 'Order not found.',
            })
        }

        if (
            !order.userId.equals(req.user._id) &&
            req.user.role !== 'admin'
        ) {
            return res.status(404).json({
                message: 'Order not found.',
            })
        }

        return res.status(200).json({
            order: buildOrderResponse(order),
        })
    } catch (error) {
        next(error)
    }
}

async function getAllOrders(req, res, next) {
    try {
        const orders = await Order.find().sort({ createdAt: -1 })

        return res.status(200).json({
            orders: orders.map(buildOrderResponse),
        })
    } catch (error) {
        next(error)
    }
}

async function updateOrderStatus(req, res, next) {
    try {
        const { id } = req.params
        const { status } = req.body ?? {}

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: 'Provide a valid order id.',
            })
        }

        if (!ORDER_STATUSES.includes(status)) {
            return res.status(400).json({
                message: 'Status must be pending or finished.',
            })
        }

        const order = await Order.findById(id)

        if (!order) {
            return res.status(404).json({
                message: 'Order not found.',
            })
        }

        order.status = status

        await order.save()

        return res.status(200).json({
            order: buildOrderResponse(order),
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
}
