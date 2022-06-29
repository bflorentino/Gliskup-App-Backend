const express = require('express');
const route = express.Router();

const { follow, unfollow, suggestedUsers } = require("../controllers/followUsersController");

route.post('/:userFollowing/:userToFollow', follow);
route.post('/unfollow/:userUnfollowing/:userToUnfollow', unfollow);
route.get('/suggestedUsers/:user', suggestedUsers);

module.exports = route;