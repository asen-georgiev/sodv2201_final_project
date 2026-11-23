function notFound(req, res) {
    res.status(404).json({
        message: 'Endpoint not found.',
    })
}

function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        return next(error)
    }

    console.error(error.message)

    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({
            message: 'Invalid JSON request body.',
        })
    }

    res.status(500).json({
        message: 'An unexpected server error occurred.',
    })
}

module.exports = {
    notFound,
    errorHandler,
}
