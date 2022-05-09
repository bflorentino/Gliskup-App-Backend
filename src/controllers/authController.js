const { addUserDb, 
        loginDb,
        setAvatarProfilePicDb,

    } = require('../services/authServices')

const { saveImage } = require('../services/storeServices')


exports.addUser = async (req, res) => {

    const serverRes = await addUserDb(req.body)
    serverRes.errorStatus && res.status(serverRes.errorStatus)
    res.send(serverRes);
}

exports.login = async (req, res) => {

    const serverRes = await loginDb(req.body)
    serverRes.errorStatus && res.status(serverRes.errorStatus)
    res.send(serverRes);
}

exports.setUploadedProfilePic = async (req, res) => {

    const picSaved = await saveImage(req.files.profilePicture.data)
    const fullPicPath = `${req.protocol}://${req.get('host')}:80/${picSaved}`
    const serverRes = await setAvatarProfilePicDb({user: req.body.user, profilePic: fullPicPath})
    serverRes.errorStatus && res.status(serverRes.errorStatus)
    res.send(serverRes);
}

exports.setAvatarProfilePic = async (req, res) => {

    const serverRes = await setAvatarProfilePicDb(req.body)
    serverRes.errorStatus && res.status(serverRes.errorStatus)
    res.send(serverRes);
}