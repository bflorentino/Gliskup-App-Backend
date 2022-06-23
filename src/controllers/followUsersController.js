const { followUser, unfollowUser } = require("../services/followUsersServices");

exports.follow = async (req, res) => {
    const serverRes = await followUser(req.params.userFollowing, req.params.userToFollow);
    res.status(serverRes.status);
    res.send(serverRes);
    res.end();
}

exports.unfollow = async (req, res) => {
    const serverRes = await unfollowUser(req.params.userUnfollowing, req.params.userToUnfollow);
    res.status(serverRes.status);
    res.send(serverRes);
    res.end();
}