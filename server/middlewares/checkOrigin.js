function checkOrigin(req, res, next) {
    const safeMethods = ['GET', 'HEAD', 'OPTIONS']

    if (safeMethods.includes(req.method)) {
        return next()
    }

    const origin = req.get('Origin')
    const allowedOrigin =
        process.env.CLIENT_URL || 'http://localhost:5173'

    if (origin && origin !== allowedOrigin) {
        return res.status(403).json({
            message: 'Request origin is not allowed.',
        })
    }

    next()
}

module.exports = checkOrigin
