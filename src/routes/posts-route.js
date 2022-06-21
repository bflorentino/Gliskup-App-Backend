const express = require('express');
const route = express.Router();

const {uploadPost, getAllPosts, getPostsByUser, removePost} = require('../controllers/postsController');

route.post('/upload', uploadPost);
route.get('/view/:userRequest', getAllPosts)
route.get('/viewProfile/:userRequestFrom/:userRequestTo', getPostsByUser)
route.post('/delete', removePost)

module.exports = route