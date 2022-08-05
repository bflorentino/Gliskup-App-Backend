const { getUserProfileDataDb } = require("../services/profileServices")

exports.getUserProfileData = async (req, res) => {

    const serverRes = await getUserProfileDataDb(req.params.userRequest, req.params.userOnline);
    res.status(serverRes.status);
    res.send(serverRes)
}