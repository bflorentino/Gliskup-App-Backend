const {getUsersByPatternDb} = require('../services/searchUsersServices');

exports.getUsersByPattern = async (req, res) => {
    const serverRes = await getUsersByPatternDb(req.params.searchPattern)
    res.status(serverRes.status);
    res.send(serverRes)
}
