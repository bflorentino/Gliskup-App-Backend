const express = require('express');
const route = express.Router();

const { follow, 
        unfollow, 
        suggestedUsers, 
        followed, 
        followers} = require("../controllers/followUsersController");

route.post('/:userFollowing/:userToFollow', follow);
route.post('/unfollow/:userUnfollowing/:userToUnfollow', unfollow);
route.get('/suggestedUsers/:user', suggestedUsers);
route.get('/userFollowed/:userToGetFollowed/:userOnline', followed);
route.get('/userFollowing/:userToGetFollowing/:userOnline', followers)

module.exports = route;