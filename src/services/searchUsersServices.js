const getConnection = require('../db/connection');
const serverRes = require('../response/response');
const { collections, httpResCodes} = require('../types/types');

exports.getUsersByPatternDb = async (searchPattern) => {

    const { db, client } = await getConnection();
    const res = new serverRes();

    try{
       await client.connect();
       const options = { projection: {_id: 0, name: 1, lastName: 1, user:1, profilePic: 1} }
       const re = new RegExp( "^" + searchPattern, "i")
       const matchedUsers = await db.collection(collections.users).find({fullName : re},options).toArray()
       res.data = matchedUsers;
       res.status = httpResCodes.success;
    }
    catch(e){
        console.log(e)
        res.status = httpResCodes.serverError;
        res.success = false;
    }
    finally{
        await client.close();
    }
    return res
}