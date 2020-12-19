const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const postRoutes = require('./routes/posts');


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/socialnetwork', {useNewUrlParser: true}).then(()=>{
    console.log('Connected to database!');
}).catch(()=>{
    console.log('Connection failed!');
});



app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use("/api/posts", postRoutes);
module.exports = app;

// mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb