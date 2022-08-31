const getConnection = require('../db/connection');
const serverRes = require('../response/response')
const {collections, httpResCodes} = require('../types/types');

exports.followUser = async ( userOnline, userToFollow ) => {
    
    /*
        Follow an user
        User Online is the user making the request
        Returns an object with the followed user
    */

    const {db, client} = await getConnection();
    const res = new serverRes();

    try{
        await client.connect();
        const users = db.collection(collections.users);
        
        const userFrom = await users.findOne({user: userOnline})
        const userTo = await users.findOne({user: userToFollow}) 

        if(!userFrom.followed)
            userFrom.followed = [];

        if(!userTo.followers)
            userTo.followers = []
        
        if(!this.isUserAFollowingUserB(userTo._id, userFrom.followed)){
            await users.updateOne({user: userOnline}, 
                {$set: {followed: [...userFrom.followed, userTo._id]}})
    
            await users.updateOne({user: userToFollow}, 
                {$set: {followers: [...userTo.followers, userFrom._id]}})

                res.data = userToFollow;
                res.status = httpResCodes.success;
                res.message = "Started Following"
        }
        else{
            res.status = httpResCodes.badRequest
            res.success = false
        }
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

exports.unfollowUser = async ( userOnline, userToUnfollow ) => {
    
    /* 
        Unfollow a user 
       Returns an object with the user unfollowed
    */

    const {db, client} = await getConnection();
    const res = new serverRes();

    try{
        await client.connect();
        const users = db.collection(collections.users);
        
        const userFrom = await users.findOne({user: userOnline})
        const userTo = await users.findOne({user: userToUnfollow}) 

        await users.updateOne({user: userOnline}, 
            {$set: {followed: userFrom.followed.filter(userId => userId.toString() !== userTo._id.toString())}})

        await users.updateOne({user: userToUnfollow}, 
            {$set: {followers: userTo.followers.filter(userId => userId.toString() !== userFrom._id.toString())}})

        res.data = userToUnfollow;
        res.status = httpResCodes.success;
        res.message = "Stoped Following"
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

exports.isUserAFollowingUserB = (userB, userAFollowing) => {
    /* Returns if user A is following User B
       userB is the object _id of the user.
       UserAFollowing is the list of users followed by user A
    */
    const isUserAFollowing = userAFollowing.find(userId => userId.toString() === userB.toString())
    return isUserAFollowing !== undefined ? true: false;
}

exports.getSuggestedUsers = async (user) => {

    /*
        Returns a list of suggested users (to follow) for a user making the request.
        Retorned users are users not followed by the user making the request and are random ordered
    */

    const {db, client} = await getConnection();
    const res = new serverRes();
    
    try{
        await client.connect();
        const users = db.collection(collections.users);
        const userToSuggest = await users.findOne({user:user});
        const usersToArray = await users.find().toArray();
        const unfollowed = [];
        
        usersToArray.map(userEval => {
            if (!this.isUserAFollowingUserB(userEval._id, userToSuggest.followed) && userEval.user !== user){
                unfollowed.push({_id: userEval._id, 
                                name: userEval.name, 
                                lastName: userEval.lastName, 
                                user: userEval.user, 
                                profilePic: userEval.profilePic 
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

exports.getFollowedUsers = async (userToViewFollowed, userOnline) => {

    /* 
        Returns an array with users followed by an user. 
        UserOnline makes the request
        UserToViewFollowed is the user to get followed list.

        It also checks if every user in the array of followed is followed by the user online
    */

    const {db, client} = await getConnection();
    const res = new serverRes();

    // if(userOnline === userToViewFollowed){
    //     res.status = httpResCodes.badRequest
    //     res.success = false;
    //     return res;
    // }

    try{
        await client.connect();
        const users = db.collection(collections.users);
        const userADb = await users.findOne({user: userToViewFollowed})
        const userBDb = await users.findOne({user: userOnline}, {projection: {followed: 1}})
        const usersFollowed = [];

        if(userADb?.followed) {
            for (let userFollowed of userADb.followed) {
                
                const userWithId = await users.findOne({_id: userFollowed})
                let followedByUserOnline = true;

                if(userToViewFollowed !== userOnline 
                    && (!this.isUserAFollowingUserB(userFollowed, userBDb.followed || [])))
                {
                        followedByUserOnline = false          
                }
                
                userFollowed = {
                    name : userWithId.name,
                    lastName: userWithId.lastName,
                    user: userWithId.user,
                    profilePic: userWithId.profilePic,
                    followedByUserOnline 
                }
                
                usersFollowed.push(userFollowed)
          }
        }
        res.data = usersFollowed;
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

exports.getFollowers = async (userToViewFollowers, userOnline) => {

    /* 
        Returns an array with an user's followers. 
        UserOnline makes the request
        UserToViewFollowers is the user to get followers list.

        It also checks if every user in the array of followers is followed by the user online
    */

    const {db, client} = await getConnection();
    const res = new serverRes();

    try{
        await client.connect();
        const users = db.collection(collections.users);
        const userADb = await users.findOne({user: userToViewFollowers})
        const userBDb = await users.findOne({user: userOnline}, {projection: {followed: 1}})
        const usersFollowers = [];

        if(userADb?.followers) {
            for (let userFollower of userADb.followers) {
                
                const userWithId = await users.findOne({_id: userFollower})
                let followedByUserOnline = false
 
                if (this.isUserAFollowingUserB(userFollower, userBDb.followed || []))
                {
                        followedByUserOnline = true          
                }

                userFollower = {
                    name : userWithId.name,
                    lastName: userWithId.lastName,
                    user: userWithId.user,
                    profilePic: userWithId.profilePic,
                    followedByUserOnline 
                }

                usersFollowers.push(userFollower)
          }
        }
        res.data = usersFollowers;
        res.status = httpResCodes.success; 

    }catch(e){
        console.log(e);
        res.success = false;
        res.status = httpResCodes.serverError;
    }
    finally{
        await client.close();
    }
    return res;
}

exports.removeUserFromFollowers = async (userOnline, userToRemove) => {
    /*
        Removes an user from the list of followers of userOnline.
        User Online can check his followers list and may remove an user
     */

        const {db, client} = await getConnection();
        const res = new serverRes();
    
        try{
            await client.connect();
            const users = db.collection(collections.users);
            
            const userFrom = await users.findOne({user: userOnline})
            const userTo = await users.findOne({user: userToRemove}) 
    
            await users.updateOne({user: userOnline}, 
                {$set: {followed: userFrom.followers.filter(userId => userId.toString() !== userTo._id.toString())}})
    
            await users.updateOne({user: userToRemove}, 
                {$set: {followers: userTo.followed.filter(userId => userId.toString() !== userFrom._id.toString())}})
    
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

        unfollowed.pop();
    }
    return shuffledArray;
}