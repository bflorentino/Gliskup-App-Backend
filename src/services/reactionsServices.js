const getConnection = require('../db/connection');
const moment = require("moment");
const { collections, httpResCodes } = require('../types/types')
const serverRes = require('../response/response');

exports.uploadReactionDb = async (reaction) => {

    const res = new serverRes();
    const {client, db} = await getConnection();

    try{
        await client.connect();
        const reactions = db.collection(collections.reactions);
        const user = await db.collection(collections.users).findOne({user : reaction.user})

        await reactions.insertOne({...reaction,
                                    user: user._id,
                                    date: moment().format('MMMM Do YYYY, h:mm:ss a')
                                })


        res.data = {postId: reaction.postId, 
                   reactionType: reaction.reactionType, 
                   reacted: true,
                   user, 
                }
        res.status = httpResCodes.created;

    }catch(e){
        res.status = httpResCodes.serverError;
        res.message = e
        console.log(e)

    }finally{
        await client.close();
    }
    return res;
}

exports.getPostsReactions = async(id, collection) => {

    const reactions = await collection.find({postId: id.toString()}).toArray();
    return reactions;
}

exports.removeReactionDb = async (reaction) => {
    
    const res = new serverRes();
    const {client, db} = await getConnection();

    try{
        await client.connect();
        const user = await db.collection(collections.users).findOne({user : reaction.user});
        await db.collection(collections.reactions).deleteOne({user : user._id, postId: reaction.postId});
        res.status = httpResCodes.success;
       
        res.data = {
            ownReactionType : null,
            reacted : false,
            postId: reaction.postId,
            user: user.user
        }

    }catch(e){
        res.status = httpResCodes.serverError;
        res.message = e
        console.log(e);
    }finally{
        await client.close();
    }
    return res
}