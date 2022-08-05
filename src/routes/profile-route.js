const express = require('express');
const route = express.Router();
const { getUserProfileData } = require("../controllers/profileControllers");

route.get('/profileData/:userRequest/:userOnline', getUserProfileData);

module.exports = route;