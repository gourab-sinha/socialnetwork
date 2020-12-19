const express = require('express');
const router = express.Router();

const Post = require('../models/posts');

router.post("", (req, res, next)=>{
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
    });
    post.save().then(createdPost=>{
        console.log(createdPost);
        res.status(201).json({
            message: 'Post added successfully',
            postId: createdPost._id,
        });
        console.log(post);
    });  
});

router.get("/:id", (req,res,next)=>{
    Post.findById(req.params.id).then(post =>{
        if(post){
            res.status(200).json(post);
        }
        else{
            res.status(404).json({message: "Post not found"});
        }
    });
})

router.put("/:id", (req, res, next) => {
    console.log(req.params.id);
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({_id: req.params.id}, post).then(result =>{
        console.log(result);
        res.status(200).json({message: "Update successful"});
    }).catch(err => {
        console.error(err);
    });
});

router.delete("/:id",(req,res,next)=>{
    console.log(req.params.id);
    Post.deleteOne({_id: req.params.id}).then((result)=>{
        console.log(result);
        console.log("Working");
        res.status(200).json({
            message: "Post deleted!"
        });
    });
});

router.use('', (req,res,next)=>{
    Post.find().then(documents =>{
        // console.log(documents);
        res.status(200).json({
            message: 'Posts fetched successfully!',
            posts: documents
        });
    }).catch(()=>{
        console.log("Failed to load posts");
    });
});

module.exports = router;