
const {MongoClient} = require('mongodb');
const {connectionString} = require('../../config/config');

module.exports = getConnection = async () => {    
    
    const dbClient = new MongoClient(connectionString);
    const database = dbClient.db("gliskup");
    
    return ({
        client: dbClient,
        db: database
    })
}