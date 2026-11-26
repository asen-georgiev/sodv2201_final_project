
const mongoose = require('mongoose')
const MenuItem = require('../models/MenuItem')

const MENU_CATEGORIES = [
    'starters',
    'mains',
    'desserts',
    'beverages',
]

const DIETARY_OPTIONS = ['vegetarian', 'gluten-free']

function buildMenuItemResponse(menuItem) {
    return {
        id: menuItem._id.toString(),
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        imageUrl: menuItem.imageUrl,
        category: menuItem.category,
        ingredients: menuItem.ingredients,
        dietaryOptions: menuItem.dietaryOptions,
        isAvailable: menuItem.isAvailable,
        isPopular: menuItem.isPopular,
    }
}

function validateMenuItem(body) {
    const {
        name,
        description,
        price,
        imageUrl,
        category,
        ingredients,
        dietaryOptions = [],
        isAvailable = true,
        isPopular = false,
    } = body ?? {}

    if (
        typeof name !== 'string' ||
        typeof description !== 'string' ||
        typeof imageUrl !== 'string' ||
        !name.trim() ||
        !description.trim() ||
        !imageUrl.trim()
    ) {
        return 'Name, description, and image URL are required.'
    }

    if (
        typeof price !== 'number' ||
        !Number.isFinite(price) ||
        price < 0.01
    ) {
        return 'Price must be at least 0.01.'
    }

    if (!MENU_CATEGORIES.includes(category)) {
        return 'Choose a valid menu category.'
    }

    if (
        !Array.isArray(ingredients) ||
        ingredients.length === 0 ||
        !ingredients.every(
            ingredient =>
                typeof ingredient === 'string' &&
                ingredient.trim()
        )
    ) {
        return 'At least one valid ingredient is required.'
    }

    if (
        !Array.isArray(dietaryOptions) ||
        !dietaryOptions.every(
            option => DIETARY_OPTIONS.includes(option)
        )
    ) {
        return 'Choose valid dietary options.'
    }

    if (
        typeof isAvailable !== 'boolean' ||
        typeof isPopular !== 'boolean'
    ) {
        return 'Availability and popularity must be boolean values.'
    }

    return null
}

function buildMenuItemFields(body) {
    return {
        name: body.name.trim(),
        description: body.description.trim(),
        price: body.price,
        imageUrl: body.imageUrl.trim(),
        category: body.category,
        ingredients: body.ingredients.map(
            ingredient => ingredient.trim()
        ),
        dietaryOptions: body.dietaryOptions ?? [],
        isAvailable: body.isAvailable ?? true,
        isPopular: body.isPopular ?? false,
    }
}

async function getMenuItems(req, res, next) {
    try {
        const menuItems = await MenuItem.find()

        return res.status(200).json({
            menuItems: menuItems.map(buildMenuItemResponse),
        })
    } catch (error) {
        next(error)
    }
}

async function getMenuItemById(req, res, next) {
    try {
        const { id } = req.params

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: 'Provide a valid menu item id.',
            })
        }

        const menuItem = await MenuItem.findById(id)

        if (!menuItem) {
            return res.status(404).json({
                message: 'Menu item not found.',
            })
        }

        return res.status(200).json({
            menuItem: buildMenuItemResponse(menuItem),
        })
    } catch (error) {
        next(error)
    }
}

async function createMenuItem(req, res, next) {
    try {
        const validationMessage = validateMenuItem(req.body)

        if (validationMessage) {
            return res.status(400).json({
                message: validationMessage,
            })
        }

        const menuItem = await MenuItem.create(
            buildMenuItemFields(req.body)
        )

        return res.status(201).json({
            menuItem: buildMenuItemResponse(menuItem),
        })
    } catch (error) {
        next(error)
    }
}

async function updateMenuItem(req, res, next) {
    try {
        const { id } = req.params

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: 'Provide a valid menu item id.',
            })
        }

        const menuItem = await MenuItem.findById(id)

        if (!menuItem) {
            return res.status(404).json({
                message: 'Menu item not found.',
            })
        }

        const updatedFields = {
            ...buildMenuItemResponse(menuItem),
            ...req.body,
        }

        const validationMessage = validateMenuItem(updatedFields)

        if (validationMessage) {
            return res.status(400).json({
                message: validationMessage,
            })
        }

        menuItem.set(buildMenuItemFields(updatedFields))

        await menuItem.save()

        return res.status(200).json({
            menuItem: buildMenuItemResponse(menuItem),
        })
    } catch (error) {
        next(error)
    }
}

async function deleteMenuItem(req, res, next) {
    try {
        const { id } = req.params

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: 'Provide a valid menu item id.',
            })
        }

        const menuItem = await MenuItem.findByIdAndDelete(id)

        if (!menuItem) {
            return res.status(404).json({
                message: 'Menu item not found.',
            })
        }

        return res.status(200).json({
            message: 'Menu item deleted successfully.',
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
}
