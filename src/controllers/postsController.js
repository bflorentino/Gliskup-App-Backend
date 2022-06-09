const { uploadPostDb, 
        getAllPostsDb, 
        getPostsByUserDb } = require('../services/postServices');

const { saveImage } = require('../services/storeServices');

exports.uploadPost = async (req, res) => {
    const postPicSaved = req.files?.image.data && await saveImage(req.files.image.data, "posts");
    const fullPicPath = postPicSaved && `${req.protocol}://${req.get('host')}:80/posts/${postPicSaved}`
    const serverRes = await uploadPostDb({...req.body, image: fullPicPath });
    res.status(serverRes.status)
    res.send(serverRes)
}

exports.getAllPosts = async (req, res) => {

    const serverRes = await getAllPostsDb(req.params.userRequest);
    res.status(serverRes.status)
    res.send(serverRes)
}

exports.getPostsByUser = async(req, res) => {

    const serverRes = await getPostsByUserDb(req.params.userRequestFrom, req.params.userRequestTo);
    res.status(serverRes.status)
    res.send(serverRes)
}