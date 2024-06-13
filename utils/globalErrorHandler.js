const { formatValidationError } = require("./format");

// Global error handler middleware
module.exports.errorHandler = function errorHandler(err, req, res, next) {
    console.log('Global Error Handler Called')
    // checking for mongoose validation error
    if(err.name === 'ValidationError'){
        return res.status(400).json(formatValidationError(err))
    }

    // other errors
    const statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    const reason = err.reason || 'Unexpected Error';
    const name = err.name || 'Server Error';

    if (statusCode === 500) {
        console.error(message); 
        message = err.customMessage || 'Internal Server Error';
    }

    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack); 
    }

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        name,
        reason
    });
}