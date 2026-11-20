const path = require('node:path')

require('dotenv').config({
    path: path.join(__dirname, '..', '.env'),
})

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = require('../models/User')
const MenuItem = require('../models/MenuItem')
const Order = require('../models/Order')
const Reservation = require('../models/Reservation')
const Cart = require('../models/Cart')

function dateInDays(days) {
    const date = new Date()
    date.setDate(date.getDate() + days)

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-')
}

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

async function seed() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing from server/.env')
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
        })

        if (mongoose.connection.name !== 'restaurant_db') {
            throw new Error(
                'The connection must target restaurant_db. Check MONGODB_URI.',
            )
        }

        const models = [User, MenuItem, Order, Reservation, Cart]

        for (const Model of models) {
            await Model.init()
        }

        const customerPasswordHash = await bcrypt.hash('customer123', 12)
        const adminPasswordHash = await bcrypt.hash('admin123', 12)

        await mongoose.connection.transaction(async session => {
            for (const Model of models) {
                const existingRecord = await Model.findOne()
                    .select('_id')
                    .session(session)
                    .lean()

                if (existingRecord) {
                    throw new Error(
                        `Seeding cancelled: "${Model.collection.name}" already contains data.`,
                    )
                }
            }

            const [alex, sam] = await User.insertMany(
                [
                    {
                        name: 'Alex Morgan',
                        email: 'alex@example.com',
                        phone: '403-555-0101',
                        role: 'customer',
                        passwordHash: customerPasswordHash,
                    },
                    {
                        name: 'Sam Rivera',
                        email: 'sam@example.com',
                        phone: '403-555-0102',
                        role: 'customer',
                        passwordHash: customerPasswordHash,
                    },
                    {
                        name: 'Jamie Parker',
                        email: 'admin@example.com',
                        phone: '403-555-0103',
                        role: 'admin',
                        passwordHash: adminPasswordHash,
                    },
                ],
                { session },
            )

            const [salad, chicken, pizza, cake, vegetablePasta, lemonade] =
                await MenuItem.insertMany(
                    [
                        {
                            name: 'Garden harvest salad',
                            description:
                                'Crisp greens, cherry tomatoes, feta and lemon dressing.',
                            price: 14.5,
                            imageUrl: '/images/dishes/garden-harvest-salad.svg',
                            category: 'starters',
                            ingredients: [
                                'Mixed greens',
                                'Cherry tomatoes',
                                'Feta',
                                'Lemon',
                                'Olive oil',
                            ],
                            dietaryOptions: ['vegetarian', 'gluten-free'],
                            isAvailable: true,
                            isPopular: true,
                        },
                        {
                            name: 'Chicken Alfredo',
                            description:
                                'Creamy parmesan sauce, grilled chicken and fresh herbs.',
                            price: 18.99,
                            imageUrl: '/images/dishes/chicken-alfredo.svg',
                            category: 'mains',
                            ingredients: [
                                'Wheat pasta',
                                'Chicken',
                                'Cream',
                                'Parmesan',
                                'Fresh herbs',
                            ],
                            dietaryOptions: [],
                            isAvailable: true,
                            isPopular: true,
                        },
                        {
                            name: 'Margherita pizza',
                            description:
                                'Tomato, fresh mozzarella and fragrant basil.',
                            price: 17.5,
                            imageUrl: '/images/dishes/margherita-pizza.svg',
                            category: 'mains',
                            ingredients: [
                                'Wheat dough',
                                'Tomato sauce',
                                'Mozzarella',
                                'Basil',
                                'Olive oil',
                            ],
                            dietaryOptions: ['vegetarian'],
                            isAvailable: true,
                            isPopular: true,
                        },
                        {
                            name: 'Chocolate lava cake',
                            description:
                                'Warm chocolate cake with a soft, rich center.',
                            price: 8.5,
                            imageUrl: '/images/dishes/chocolate-lava-cake.svg',
                            category: 'desserts',
                            ingredients: [
                                'Chocolate',
                                'Wheat flour',
                                'Butter',
                                'Eggs',
                                'Sugar',
                            ],
                            dietaryOptions: ['vegetarian'],
                            isAvailable: true,
                            isPopular: false,
                        },
                        {
                            name: 'Vegetable pasta',
                            description:
                                'Seasonal vegetables, tomato sauce and fresh basil.',
                            price: 16.5,
                            imageUrl: '/images/dishes/vegetable-pasta.svg',
                            category: 'mains',
                            ingredients: [
                                'Wheat pasta',
                                'Zucchini',
                                'Bell pepper',
                                'Tomato sauce',
                                'Basil',
                            ],
                            dietaryOptions: ['vegetarian'],
                            isAvailable: false,
                            isPopular: false,
                        },
                        {
                            name: 'House lemonade',
                            description:
                                'Fresh lemon, a little sweetness and plenty of sunshine.',
                            price: 5.5,
                            imageUrl: '/images/dishes/house-lemonade.svg',
                            category: 'beverages',
                            ingredients: ['Lemon', 'Water', 'Sugar'],
                            dietaryOptions: ['vegetarian', 'gluten-free'],
                            isAvailable: true,
                            isPopular: false,
                        },
                    ],
                    { session },
                )

            const alexItems = [
                purchasedItem(chicken, 1),
                purchasedItem(cake, 1),
            ]

            const samItems = [
                purchasedItem(pizza, 2),
                purchasedItem(lemonade, 2),
            ]

            await Order.insertMany(
                [
                    {
                        userId: alex._id,
                        items: alexItems,
                        fulfillmentType: 'pickup',
                        deliveryAddress: '',
                        notes: '',
                        total: calculateTotal(alexItems),
                        status: 'pending',
                        createdAt: new Date(),
                    },
                    {
                        userId: sam._id,
                        items: samItems,
                        fulfillmentType: 'delivery',
                        deliveryAddress: '123 Example Street, Calgary, AB',
                        notes: 'Please ring the doorbell.',
                        total: calculateTotal(samItems),
                        status: 'finished',
                        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    },
                ],
                { session },
            )

            await Reservation.insertMany(
                [
                    {
                        userId: alex._id,
                        type: 'table',
                        date: dateInDays(7),
                        time: '18:30',
                        guests: 2,
                        phone: alex.phone,
                        notes: 'A window seat, if available.',
                        eventType: null,
                        menuPreference: '',
                        status: 'pending',
                    },
                    {
                        userId: sam._id,
                        type: 'event',
                        date: dateInDays(8),
                        time: '19:30',
                        guests: 6,
                        phone: sam.phone,
                        notes: 'Please bring the birthday dessert after the meal.',
                        eventType: 'birthday',
                        menuPreference: 'Vegetarian selection',
                        status: 'pending',
                    },
                    {
                        userId: alex._id,
                        type: 'table',
                        date: dateInDays(-3),
                        time: '18:00',
                        guests: 4,
                        phone: alex.phone,
                        notes: '',
                        eventType: null,
                        menuPreference: '',
                        status: 'finished',
                    },
                ],
                { session },
            )
            await Cart.insertMany(
                [
                    {
                        userId: alex._id,
                        items: [
                            { menuItemId: chicken._id, quantity: 1 },
                            { menuItemId: cake._id, quantity: 1 },
                        ],
                    },
                    {
                        userId: sam._id,
                        items: [
                            { menuItemId: pizza._id, quantity: 1 },
                            { menuItemId: lemonade._id, quantity: 2 },
                        ],
                    },
                ],
                { session },
            )
        })

        console.log('Database seeded successfully:')
        console.log('- 3 users: 2 customers and 1 admin')
        console.log('- 6 menu items')
        console.log('- 2 orders')
        console.log('- 3 reservations')
        console.log('- 2 customer carts')
    } catch (error) {
        console.error('Seeding failed:', error.message)
        process.exitCode = 1
    } finally {
        await mongoose.disconnect()
    }
}

seed()
