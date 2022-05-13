const express = require('express');
const route = express.Router();

const {uploadPost, getAllPosts} = require('../controllers/postsController');

route.post('/upload', uploadPost);
route.get('/view', getAllPosts)

module.exports = route