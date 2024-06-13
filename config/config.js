const dotenv = require('dotenv')

dotenv.config()

const dbName = process.env.DB_NAME
const dbUserName = process.env.DB_USERNAME
const dbPassword = process.env.DB_PASSWORD
const dbCluster = process.env.DB_CLUSTER

module.exports = {
    
    // Database
    dbConnectonLink : `mongodb+srv://${dbUserName}:${dbPassword}@${dbCluster}/${dbName}?retryWrites=true&w=majority`,

    // server
    port: process.env.PORT,

    // auth
    jwtKey: process.env.JWT_KEY,
    logincookietoken: process.env.LOGIN_COOKIE_TOKEN,
    ownerlogintoken: process.env.OWNER_LOGIN_TOKEN,

    // Google Client
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallBack: '/auth/google/callback',


}