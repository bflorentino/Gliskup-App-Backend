const { followUser, 
        unfollowUser, 
        getSuggestedUsers,
        getFollowedUsers,
        getFollowers } = require("../services/followUsersServices");

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

exports.suggestedUsers = async (req, res) => {
    const serverRes = await getSuggestedUsers(req.params.user);
    res.status(serverRes.status);
    res.send(serverRes);
    res.end();
}

exports.followed = async (req, res) => {
    const serverRes = await getFollowedUsers(req.params.userToGetFollowed, req.params.userOnline);
    res.status(serverRes.status);
    res.send(serverRes);
    res.end();
}

exports.followers = async (req, res) => {
    const serverRes = await getFollowers(req.params.userToGetFollowers, req.params.userOnline);
    res.status(serverRes.status);
    res.send(serverRes);
    res.end();
}

