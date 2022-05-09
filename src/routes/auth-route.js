const express = require('express');
const route = express.Router();

const { addUser, 
        login, 
        setAvatarProfilePic, 
        setUploadedProfilePic 
    } = require('../controllers/authController')

route.post('/user', addUser)
route.post('/user/login', login)
route.put('/user/setUploadedPic', setUploadedProfilePic)
route.put('/user/setAvatarPic', setAvatarProfilePic)

module.exports = route;