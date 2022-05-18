const express = require('express');
const route = express.Router();

const { uploadReaction } = require('../controllers/reactionsController');

route.post('/react', uploadReaction)

module.exports = route