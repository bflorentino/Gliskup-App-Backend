const route = require('express').Router()
const {getUsersByPattern} = require('../controllers/searchUsersController')

route.get('/:searchPattern', getUsersByPattern);

module.exports = route;