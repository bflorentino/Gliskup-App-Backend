const express = require('express');
const route = express.Router();

const { uploadReaction, removeReaction } = require('../controllers/reactionsController');

route.post('/react', uploadReaction)
route.post('/remove', removeReaction);

module.exports = route