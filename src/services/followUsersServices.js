const getConnection = require('../db/connection');
const serverRes = require('../response/response')
const {collections, httpResCodes} = require('../types/types');
const { ObjetcId }  = require ('mongodb');

// Follow an user
exports.followUser = async ( userFollowing, userToFollow ) => {

    const {db, client} = await getConnection();
    const res = new serverRes();

    try{
        await client.connect();
        const users = db.collection(collections.users);
        
        const userFrom = await users.findOne({user: userFollowing})
        const userTo = await users.findOne({user: userToFollow}) 

        if(!userFrom.followed)
            userFrom.followed = [];

        if(!userTo.followers)
            userTo.followers = []
        
        await users.updateOne({user: userFollowing}, 
            {$set: {followed: [...userFrom.followed, userTo._id]}})

        await users.updateOne({user: userToFollow}, 
            {$set: {followers: [...userTo.followers, userFrom._id]}})

        res.data = userToFollow;
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

// Unfollow a user
exports.unfollowUser = async ( userUnfollowing, userToUnfollow ) => {

    const {db, client} = await getConnection();
    const res = new serverRes();

    try{
        await client.connect();
        const users = db.collection(collections.users);
        
        const userFrom = await users.findOne({user: userUnfollowing})
        const userTo = await users.findOne({user: userToUnfollow}) 

        await users.updateOne({user: userUnfollowing}, 
            {$set: {followed: userFrom.followed.filter(userId => userId.toString() !== userTo._id.toString())}})

        await users.updateOne({user: userToUnfollow}, 
            {$set: {followers: userTo.followers.filter(userId => userId.toString() !== userFrom._id.toString())}})

        res.data = userToUnfollow;
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