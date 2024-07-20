const { formatValidationError } = require("./format");
const {detectClient} = require('./requestAgent')

module.exports.errorHandler = function errorHandler(err, req, res, next) {
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

    const client = detectClient(req);
    if(client){
        if(client === 'Browser'){
            return res.status(statusCode).send(`
             <div style="width:100%; height:100vh; display:flex; justify-content: center; align-items:center; flex-direction:column;">
                <h1>${statusCode}</h1>
                <p>${message}</p>
                <a href="/">Return to Homepage</a>
             </div>
            `)
        }
        else if(client === 'Fetch API'){
            return res.status(statusCode).json({
                status: 'error',
                statusCode,
                message,
                name,
                reason
            })
        }
    }
    else{
        return res.status(statusCode).send(`
             <div style="width:100%; height:100vh; display:flex; justify-content: center; align-items:center; flex-direction:column;">
                <h1>Your Browser is not secure</h1>
             </div>
        `)
    }
}