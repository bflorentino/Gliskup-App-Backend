const moment = require('moment');
const getConnection = require('../db/connection');
const serverRes = require('../response/response');
const { collections, httpResCodes} = require('../types/types');
const { getPostsReactions } = require('./reactionsServices');

exports.uploadPostDb = async (post) => {

    const {db, client} = await getConnection();
    const res = new serverRes();

    try{
        await client.connect()
        const posts = db.collection(collections.posts)
        const users = db.collection(collections.users)
        const postUploadedBy = await users.findOne({user : post.user});
        
        const postToDb = {
            text: post.text,
            image: post.image,
            fromUser: postUploadedBy._id,
            date: moment().format('MMMM Do YYYY, h:mm:ss a')
        }
        await posts.insertOne(postToDb);

        res.data = {
            fromUser: await getUser(postToDb.fromUser, db.collection(collections.users)),
            relativeTime:  moment(postToDb.date, 'MMMM Do YYYY, h:mm:ss a').fromNow(),
            reactions : [],
            reacted: false,
            ownReactionType : null,
            text: postToDb.text,
            image: postToDb.image
        }

        res.message = "Post Uploaded successfully"
        res.status = httpResCodes.created

    }catch(e){
        console.log(e)
        res.status = httpResCodes.serverError;
        res.success = false 
    }
    finally{
        client.close()
    }
    return res
}

const getUser = async (id, collection) => {

    const options = {
        projection: {_id: 0, name: 1, lastName: 1, user: 1, profilePic : 1}
    }
    const userDb = await collection.findOne({_id: id}, options)
    return userDb
}

const getUserByUserName = async (user, collection) => {

    const options = {
        projection: {_id: 1}
    }
    const userDb = await collection.findOne({user}, options)
    return userDb
}

// Getting all posts
exports.getAllPostsDb = async (userRequest) => {

    const {db, client} = await getConnection();
    const res = new serverRes();

    try{
        await client.connect()
        const posts = db.collection(collections.posts);

        const postDb = (await posts.find().toArray()).reverse();
        const processedPosts = await processPosts(postDb, userRequest, db);

        res.status = httpResCodes.success;
        res.data = processedPosts
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

// Posts by User
exports.getPostsByUserDb = async (userRequestFrom, userRequestTo) => {

    const {db, client} = await getConnection();
    const res = new serverRes();

    try{
        await client.connect()
        const posts = db.collection(collections.posts);
        const userId = await getUserByUserName(userRequestTo, db.collection(collections.users))
        const userPosts = (await posts.find({fromUser: userId._id}).toArray()).reverse();
        const processedPosts = await processPosts(userPosts, userRequestFrom, db);

        res.status = httpResCodes.success;
        res.data = processedPosts;
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

const processPosts = async (posts, userRequestFrom, db) => {

    for (const post of posts){

        post.fromUser = await getUser(post.fromUser, db.collection(collections.users));
        post.relativeTime = moment(post.date, 'MMMM Do YYYY, h:mm:ss a').fromNow();
        post.reactions = await getPostsReactions(post._id, db.collection(collections.reactions));
        post.reacted = false;
        post.ownReactionType = null; 

        for(const reaction of post.reactions){
            
            reaction.user = await getUser(reaction.user, db.collection(collections.users));
            
            if(reaction.user.user === userRequestFrom){
                post.reacted = true;
                post.ownReactionType = reaction.reactionType;
            } 
        }
    }
    return posts;
}