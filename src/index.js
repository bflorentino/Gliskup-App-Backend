const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const app = express()

app.use(cors('*'));
app.use('/profilePic',express.static('public/profilePics'));

app.use(fileUpload());

app.use(express.urlencoded({
  extended: true,
}))

app.use(express.json());

// routes
const auth = require('./routes/auth-route');

app.use('/auth', auth);

app.listen(80, () => {
  console.log("server on port 80");
});