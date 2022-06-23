const express = require('express');
const route = express.Router();

const { follow, unfollow } = require("../controllers/followUsersController");

route.post('/:userFollowing/:userToFollow', follow);
route.post('/unfollow/:userUnfollowing/:userToUnfollow', unfollow);

module.exports = route;
