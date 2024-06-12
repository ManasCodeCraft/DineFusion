const { syncHandler } = require("./errorHandlers");

module.exports.formatValidationError = syncHandler(function (error){
    var errors = {};
    for (const field in error.errors) {
      errors[field] = error.errors[field].message;
    }

    error.message = 'Auth Validation Failed';
    error.statusCode = 400;
    error.errors = errors;

    return error;
})

module.exports.getError = syncHandler(function (statusCode, name, message){
    var error = new Error(message);
    error.name = name;
    error.statusCode = statusCode;
    return error;
})

module.exports.unexpectedError = syncHandler(function (statusCode){
    if(!statusCode){
        statusCode = 500;
    }
    return module.exports.getError(statusCode, 'Error', "An unexpected error occurred");
})