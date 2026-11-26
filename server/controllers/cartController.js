const mongoose = require('mongoose')
const Cart = require('../models/Cart')
const MenuItem = require('../models/MenuItem')

const MAX_QUANTITY = 50

function isValidQuantity(quantity, min) {
    return (
        Number.isInteger(quantity) &&
        quantity >= min &&
        quantity <= MAX_QUANTITY
    )
}

async function upsertCart(userId) {
    try {
        return await Cart.findOneAndUpdate(
            {
                userId,
            },
            {
                $setOnInsert: {
                    items: [],
                },
            },
            {
                upsert: true,
                returnDocument: 'after',
            },
        )
    } catch (error) {
        if (error.code === 11000) {
            return Cart.findOne({
                userId,
            })
        }

        throw error
    }
}

async function buildCartResponse(cart) {
    if (!cart || cart.items.length === 0) {
        return []
    }

    const dishes = await MenuItem.find({
        _id: { $in: cart.items.map(item => item.menuItemId) },
    })

    return cart.items.map(item => {
        const dish = dishes.find(menuItem =>
            menuItem._id.equals(item.menuItemId),
        )

        return {
            menuItemId: item.menuItemId.toString(),
            quantity: item.quantity,
            name: dish?.name ?? 'Removed menu item',
            imageUrl: dish?.imageUrl ?? '',
            price: dish?.price ?? 0,
            isAvailable: dish?.isAvailable ?? false,
        }
    })
}

async function getCart(req, res, next) {
    try {
        const cart = await Cart.findOne({
            userId: req.user._id,
        })

        return res.status(200).json({
            cart: await buildCartResponse(cart),
        })
    } catch (error) {
        next(error)
    }
}

async function addCartItem(req, res, next) {
    try {
        const { menuItemId, quantity = 1 } = req.body ?? {}

        if (
            typeof menuItemId !== 'string' ||
            typeof quantity !== 'number'
        ) {
            return res.status(400).json({
                message: 'Provide valid menuItemId and quantity fields.',
            })
        }

        if (!mongoose.isObjectIdOrHexString(menuItemId)) {
            return res.status(400).json({
                message: 'Provide a valid menu item id.',
            })
        }

        if (!isValidQuantity(quantity, 1)) {
            return res.status(400).json({
                message: `Quantity must be a whole number between 1 and ${MAX_QUANTITY}.`,
            })
        }

        const dish = await MenuItem.findById(menuItemId)

        if (!dish) {
            return res.status(404).json({
                message: 'Menu item not found.',
            })
        }

        if (!dish.isAvailable) {
            return res.status(400).json({
                message: `${dish.name} is currently unavailable.`,
            })
        }

        const cart = await upsertCart(req.user._id)

        const cartItem = cart.items.find(item =>
            item.menuItemId.equals(menuItemId),
        )

        if (cartItem) {
            if (cartItem.quantity + quantity > MAX_QUANTITY) {
                return res.status(400).json({
                    message: `You can order up to ${MAX_QUANTITY} of the same dish.`,
                })
            }

            cartItem.quantity += quantity
        } else {
            cart.items.push({
                menuItemId,
                quantity,
            })
        }

        await cart.save()

        return res.status(200).json({
            cart: await buildCartResponse(cart),
        })
    } catch (error) {
        next(error)
    }
}

async function updateCartItem(req, res, next) {
    try {
        const { menuItemId } = req.params
        const { quantity } = req.body ?? {}

        if (!mongoose.isObjectIdOrHexString(menuItemId)) {
            return res.status(400).json({
                message: 'Provide a valid menu item id.',
            })
        }

        if (typeof quantity !== 'number') {
            return res.status(400).json({
                message: 'Provide a valid quantity field.',
            })
        }

        if (!isValidQuantity(quantity, 0)) {
            return res.status(400).json({
                message: `Quantity must be a whole number between 0 and ${MAX_QUANTITY}.`,
            })
        }

        const cart = await Cart.findOne({
            userId: req.user._id,
        })

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found.',
            })
        }

        const cartItem = cart.items.find(item =>
            item.menuItemId.equals(menuItemId),
        )

        if (!cartItem) {
            return res.status(404).json({
                message: 'This dish is not in your cart.',
            })
        }

        if (quantity > cartItem.quantity) {
            const dish = await MenuItem.findById(menuItemId)

            if (!dish || !dish.isAvailable) {
                return res.status(400).json({
                    message: 'This dish is currently unavailable.',
                })
            }
        }

        if (quantity === 0) {
            cart.items = cart.items.filter(
                item => !item.menuItemId.equals(menuItemId),
            )
        } else {
            cartItem.quantity = quantity
        }

        await cart.save()

        return res.status(200).json({
            cart: await buildCartResponse(cart),
        })
    } catch (error) {
        next(error)
    }
}

async function removeCartItem(req, res, next) {
    try {
        const { menuItemId } = req.params

        if (!mongoose.isObjectIdOrHexString(menuItemId)) {
            return res.status(400).json({
                message: 'Provide a valid menu item id.',
            })
        }

        const cart = await Cart.findOne({
            userId: req.user._id,
        })

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found.',
            })
        }

        const itemInCart = cart.items.some(item =>
            item.menuItemId.equals(menuItemId),
        )

        if (!itemInCart) {
            return res.status(404).json({
                message: 'This dish is not in your cart.',
            })
        }

        cart.items = cart.items.filter(
            item => !item.menuItemId.equals(menuItemId),
        )

        await cart.save()

        return res.status(200).json({
            cart: await buildCartResponse(cart),
        })
    } catch (error) {
        next(error)
    }
}

async function clearCart(req, res, next) {
    try {
        const cart = await Cart.findOne({
            userId: req.user._id,
        })

        if (!cart) {
            return res.status(200).json({
                cart: [],
            })
        }

        cart.items = []

        await cart.save()

        return res.status(200).json({
            cart: [],
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart,
}
