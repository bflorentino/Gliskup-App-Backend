const express = require('express');
const route = express.Router();
const { getUserProfileData } = require("../controllers/profileControllers");

route.get('/profileData/:userRequest', getUserProfileData);

module.exports = route;