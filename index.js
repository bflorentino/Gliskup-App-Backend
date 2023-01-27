const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const auth = require('./src/routes/auth-route');
const posts = require('./src/routes/posts-route')
const reactions = require('./src/routes/reactions-route');
const profile = require('./src/routes/profile-route');
const searchUsers = require('./src/routes/search-route');
const follow = require('./src/routes/follow-route');
const {port} = require ('./config/config')

const app = express()

app.use(cors('*'));
app.use('/profilePic',express.static('public/profilePics'));
app.use('/posts',express.static('public/posts'));


app.use(fileUpload());
app.use(express.urlencoded({
  extended: true,
}))

app.use(express.json());

// routes
app.use('/auth', auth);
app.use('/post', posts )
app.use('/reaction', reactions)
app.use('/user', profile)
app.use('/search', searchUsers)
app.use('/follow', follow);

app.get("/", (req, res)=> {
  res.send("Home Page")
})

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});