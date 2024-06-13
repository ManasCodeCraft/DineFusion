
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
            return fn(...args); // Forwarding all arguments to the original function
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
            return await fn(...args); // Forwarding all arguments to the original function
        } catch (err) {
            console.error(err); // Log the error for debugging purposes
            throw err; // Re-throw the error to be caught by the parent function
        }
    };
}

module.exports = {
    asyncRequestHandler,
    syncHandler,
    asyncHandler
};
