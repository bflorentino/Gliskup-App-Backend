const moment = require('moment');
const getConnection = require('../db/connection');
const serverRes = require('../response/response');
const { collections, httpResCodes} = require('../types/types');

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

exports.getAllPostsDb = async () => {

    const {db, client} = await getConnection();
    const res = new serverRes();

    try{
        await client.connect()
        const posts = db.collection(collections.posts);

        const postDb = await (await posts.find().toArray()).reverse();

        for (const post of postDb){
            post.fromUser = await getUser(post.fromUser, db.collection(collections.users));
            post.relativeTime = moment(post.date, 'MMMM Do YYYY, h:mm:ss a').fromNow()
        }
        res.status = httpResCodes.success;
        res.data = postDb
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