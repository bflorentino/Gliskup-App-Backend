const getConnection = require('../db/connection');
const serverRes = require('../response/response')
const {collections, httpResCodes} = require('../types/types');

exports.followUser = async ( userFollowing, userToFollow ) => {
    // Follow an user

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
        res.success = false;
        res.status = httpResCodes.serverError
    }
    finally{
        await client.close();
    }
    return res;
}

exports.unfollowUser = async ( userUnfollowing, userToUnfollow ) => {
    // Unfollow a user

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
        res.success = false;
        res.status = httpResCodes.serverError
    }
    finally{
        await client.close();
    }
    return res;
}

const isUserAFollowingUserB = (userB, userAFollowing) => {
    // Returns if user A is following User B
    const isUserAFollowing = userAFollowing.find(userId => userId.toString() === userB.toString())
    return isUserAFollowing !== undefined ? true: false;
}

exports.getSuggestedUsers = async (user) => {

    const {db, client} = await getConnection();
    const res = new serverRes();

    try{
        await client.connect();
        const users = db.collection(collections.users);
        const userToSuggest = await users.findOne({user:user});
        const usersToArray = await users.find().toArray();
        const unfollowed = [];
        
        usersToArray.map(userEval => {
            if (!isUserAFollowingUserB(userEval._id, userToSuggest.followed) && userEval.user !== user){
                unfollowed.push({_id: userEval._id, 
                                name: userEval.name, 
                                lastName: userEval.lastName, 
                                user: userEval.user, profilePic: 
                                userEval.profilePic 
                            })
            }
        }) 

        const shuffledSuggested = shuffleArray(unfollowed);
        res.data = shuffledSuggested;
        res.status = httpResCodes.success;
    }
    catch(e){
        console.log(e);
        res.success = false;
        res.status = httpResCodes.serverError;
    }
    finally{
        await client.close();
    }
    return res;
}

const shuffleArray = (unfollowed) => {

    const maxLength = unfollowed.length >= 100 ? 100 : unfollowed.length;
    let shuffledArray = [];

    for(let i = 0; i < maxLength; i++){
        
        let randomPosition = Math.floor(Math.random() * unfollowed.length);
        shuffledArray.push(unfollowed[randomPosition])

        // Swaping variables to remove last position in unfollowed
        let temp = unfollowed[randomPosition];
        unfollowed[randomPosition] = unfollowed[unfollowed.length - 1];
        unfollowed[unfollowed.length - 1] = temp;
    }
    return shuffledArray;
}