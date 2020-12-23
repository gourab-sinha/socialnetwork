const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const MIME_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};



const Post = require('../models/posts');


const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        const isValid = MIME_TYPE[file.mimetype];
        let error = new Error('Invalid mime type');
        if(isValid){
            error = null
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        console.log(name);
        const ext = MIME_TYPE[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});


router.post("",checkAuth, multer({storage: storage}).single("image"),(req, res, next)=>{
    const url = req.protocol + "://" + req.get("host");
    console.log(url);
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });
    console.log("POST REQUEST");
    console.log(req.file.filename);
    console.log(post.imagePath);
    post.save().then(createdPost=>{
        console.log(createdPost.imagePath);
        res.status(200).json({
            message: 'Post added successfully',
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath
            }
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

router.put("/:id", checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
    // console.log(req.file);
    let imagePath = req.body.imagePath;
    if(req.file){
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
    console.log(post);
    Post.updateOne({_id: req.params.id}, post).then(result =>{
        // console.log(result);
        res.status(200).json({message: "Update successful"});
    }).catch(err => {
        console.error(err);
    });
});

router.delete("/:id",checkAuth, (req,res,next)=>{
    console.log(req.params.id);
    Post.deleteOne({_id: req.params.id}).then((result)=>{
        console.log(result);
        console.log("Working");
        res.status(200).json({
            message: "Post deleted!"
        });
    });
});

router.get('', (req,res,next)=>{
    console.log(req.query);
    const pageSize =  +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find(); 
    let fetchedPost;
    if(pageSize && currentPage){
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    postQuery.then(documents =>{ 
        fetchedPost = documents;
        return Post.count()
    }).then( count => {
        res.status(200).json({
            message: 'Posts fetched successfully!',
            posts: fetchedPost,
            maxPosts: count,
        });
    }).catch(()=>{
        console.log("Failed to load posts");
    });
});

module.exports = router;