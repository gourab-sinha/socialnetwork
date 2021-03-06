const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const path = require('path');

const mongoose = require('mongoose');
const { pathToFileURL } = require('url');
mongoose.connect('mongodb://localhost:27017/socialnetwork', {useNewUrlParser: true}).then(()=>{
    console.log('Connected to database!');
}).catch(()=>{
    console.log('Connection failed!');
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static('backend/images'));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);
module.exports = app;

// mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb