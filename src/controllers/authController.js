const { addUserDb, loginDb } = require('../services/authServices')

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