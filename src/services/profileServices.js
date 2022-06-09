const getConnection = require('../db/connection');
const serverRes = require('../response/response');
const { collections, httpResCodes} = require('../types/types');

exports.getUserProfileDataDb = async (userRequest) => {

    const {db, client} = await getConnection();
    const res = new serverRes();
    
    try{
        await client.connect();

        const users = db.collection(collections.users);
        
        const options = { projection:{_id: 0, 
                                    name: 1, 
                                    lastName: 1, 
                                    phone: 1,
                                    email: 1, 
                                    user: 1, 
                                    profilePic: 1,
                                    presentation : 1
                                }
                        }
        
        const userData = await users.findOne({user: userRequest}, options);
        userData.presentation = userData?.presentation || "No Presentation"; 
        res.data = userData;
        res.status = httpResCodes.success;
    }
    catch(e){
        console.log(e)
        res.status = httpResCodes.serverError
    }
    finally{
        await client.close();
    }   
    return res;
}