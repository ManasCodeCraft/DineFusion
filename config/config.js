const dotenv = require('dotenv')

dotenv.config()

const dbName = process.env.DB_NAME
const dbUserName = process.env.DB_USERNAME
const dbPassword = process.env.DB_PASSWORD
const dbCluster = process.env.DB_CLUSTER

module.exports = {

    dbConnectonLink : `mongodb+srv://${dbUserName}:${dbPassword}@${dbCluster}/${dbName}/?retryWrites=true&w=majority`,
}