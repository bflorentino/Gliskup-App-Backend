const getConnection = require('../db/connection');
const serverRes = require('../response/response');
const { collections, httpResCodes} = require('../types/types');
const { isUserAFollowingUserB } = require('./followUsersServices');

exports.getUserProfileDataDb = async (userRequest, userOnline ) => {

    const {db, client} = await getConnection();
    const res = new serverRes();
    
    try{
        await client.connect();
        const users = db.collection(collections.users);
        const options = { projection:{_id: 1, 
                                    name: 1, 
                                    lastName: 1, 
                                    phone: 1,
                                    email: 1, 
                                    user: 1, 
                                    profilePic: 1,
                                    presentation : 1,
                                    followed: 1,
                                    followers : 1
                                }
                        }

        const userRequestData = await users.findOne({user: userRequest}, options);
        const userOnlineData = await users.findOne({user: userOnline})
        userRequestData.followed = userRequestData?.followed?.length || 0;
        userRequestData.followers = userRequestData?.followers?.length || 0;
        userRequestData.presentation = userRequestData?.presentation || "No Presentation";
        
        if(isUserAFollowingUserB(userRequestData._id, userOnlineData.followed || [])){
            userRequestData.followedByUserOnline = true;
        }else{
            userRequestData.followedByUserOnline = false;
        }
        res.data = userRequestData;
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