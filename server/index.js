require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/authRoutes')
const reservationsRoutes = require('./routes/reservationsRoutes')
const checkOrigin = require('./middlewares/checkOrigin')
const {
    notFound,
    errorHandler,
} = require('./middlewares/errorMiddleware')

const app = express()

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(cors({
    origin: clientUrl,
    credentials: true,
}))

app.use(express.json())
app.use(cookieParser())
app.use(checkOrigin)

app.get('/api/health', (req, res) => {
    const databaseConnected = mongoose.connection.readyState === 1

    res.status(databaseConnected ? 200 : 503).json({
        server: 'running',
        database: databaseConnected ? 'connected' : 'disconnected',
    })
})

app.use('/api/auth', authRoutes)
app.use('/api/reservations', reservationsRoutes)
app.use(notFound)
app.use(errorHandler)

async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing from server/.env')
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
        })

        console.log('Connected to MongoDB Atlas')

        const port = process.env.PORT || 3000

        const server = app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`)
        })

        server.on('error', error => {
            console.error('Server failed to listen:', error.message)
            process.exit(1)
        })
    } catch (error) {
        console.error('Server startup failed:', error.message)
        process.exit(1)
    }
}

startServer()
