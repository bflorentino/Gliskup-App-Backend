const express = require('express');
const route = express.Router();

const { addUser, login } = require('../controllers/authController')

route.post('/user', addUser)
route.get('/user', login)

module.exports = route;