const { addUserDb, 
        loginDb,
        setAvatarProfilePicDb,

    } = require('../services/authServices')

const { saveImage } = require('../services/storeServices')


exports.addUser = async (req, res) => {

    const serverRes = await addUserDb(req.body)
    res.status(serverRes.status)
    res.send(serverRes);
}

exports.login = async (req, res) => {

    const serverRes = await loginDb(req.body)
    res.status(serverRes.status)
    res.send(serverRes);
}

exports.setUploadedProfilePic = async (req, res) => {

    const picSaved = await saveImage(req.files.profilePicture.data, "profilePics")
    const fullPicPath = `${req.protocol}://${req.get('host')}:80/profilePic/${picSaved}`
    const serverRes = await setAvatarProfilePicDb({user: req.body.user, profilePic: fullPicPath})
    res.status(serverRes.status)
    console.log(serverRes)
    res.send(serverRes);
}

exports.setAvatarProfilePic = async (req, res) => {
    
    const serverRes = await setAvatarProfilePicDb(req.body)
    res.status(serverRes.status)
    console.log(serverRes)
    res.send(serverRes);
}