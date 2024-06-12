const { formatValidationError } = require("./format");

// Handler for asynchronous requests, typically used for controllers and middlewares
function asyncRequestHandler(fn) {
    return async function (req, res, next) {
        try {
            await fn(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}

// Handler for synchronous functions, typically used for utilities and services
function syncHandler(fn) {
    return function (...args) { // args is the parameter name representing rest parameters
        try {
            fn(...args); // Forwarding all arguments to the original function
        } catch (err) {
            console.error(err); // Log the error for debugging purposes
            throw err; // Re-throw the error to be caught by the parent function
        }
    };
}

// Handler for asynchronous functions, typically used for utilities and services
function asyncHandler(fn) {
    return async function (...args) { // args is the parameter name representing rest parameters
        try {
            await fn(...args); // Forwarding all arguments to the original function
        } catch (err) {
            console.error(err); // Log the error for debugging purposes
            throw err; // Re-throw the error to be caught by the parent function
        }
    };
}

// Global error handler middleware
function errorHandler(err, req, res, next) {

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

module.exports = {
    asyncRequestHandler,
    syncHandler,
    asyncHandler,
    errorHandler
};
