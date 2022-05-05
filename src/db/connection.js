
const {MongoClient} = require('mongodb');
const URI = require('./connectionString');


module.exports = getConnection = async () => {    
    
    const dbClient = new MongoClient(URI);
    const database = dbClient.db("gliskup");
    
    return ({
        client: dbClient,
        db: database
    })
}