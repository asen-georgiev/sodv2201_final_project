require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
}))

app.use(express.json())

app.get('/api/health', (req, res) => {
    const databaseConnected = mongoose.connection.readyState === 1

    res.status(databaseConnected ? 200 : 503).json({
        server: 'running',
        database: databaseConnected ? 'connected' : 'disconnected',
    })
})

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
