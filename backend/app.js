const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/socialnetwork', {useNewUrlParser: true}).then(()=>{
    console.log('Connected to database!');
}).catch(()=>{
    console.log('Connection failed!');
});

const Post = require('../backend/models/posts');

app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});


app.post("/api/posts", (req, res, next)=>{
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
    });
    post.save();
    console.log(post);
    res.status(201).json({
        message: 'Post added successfully'
    });
});

app.delete("/api/posts/:id",(req,res,next)=>{
    Post.deleteOne({_id: req.params.id}).then((result)=>{
        console.log(result);
        res.status(200).json({
            message: "Post deleted!"
        });
    });
    
});

app.use('/api/posts/', (req,res,next)=>{
    Post.find().then(documents =>{
        // console.log(documents);
        res.status(200).json({
            message: 'Posts fetched successfully!',
            posts: documents
        });
    }).catch(()=>{
        console.log("Failed to load posts");
    });
    // const posts = [
    //     {
    //         id: 'asdf23', 
    //         title: 'First server-side post',
    //         content: 'This is coming from the server'
    //     },
    //     {
    //         id: 'assfdf23', 
    //         title: 'Second server-side post',
    //         content: 'This is coming from the server'
    //     }
    // ];
    
});



module.exports = app;

// mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb