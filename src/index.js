const express = require('express')
const cors = require('cors')
const body = require('body-parser')
const app = express()

app.use(cors('*'));

app.use(express.urlencoded({
  extended: true,
}))

app.use(express.json())

// routes
const auth = require('./routes/auth-route');

app.use('/auth', auth);

app.listen(80, () => {
  console.log("server on port 80");
});