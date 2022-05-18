const { uploadReactionDb } = require("../services/reactionsServices");

exports.uploadReaction = async (req, res) => {
    const response = await uploadReactionDb(req.body)
    res.status(response.status);
    res.send(response)
}