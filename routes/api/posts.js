const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

//POST api/posts
// add new post
router.post('/',
[
    auth,
    [
        check('text','text is required!').not().isEmpty()
    ]
],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array() });
    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        const post = await newPost.save();
        res.json(post);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error!');
    }
   
});

//GET /api/posts
//get all posts
router.get('/',auth, async (req,res)=>{
    try {
        const posts = await Post.find().sort({date: -1}); //desc
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error!');
    }
});


//GET /api/posts/:id
//get a specific post
router.get('/:id',auth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id); 
        if(!post) return res.status(404).json({msg: 'Пост не найден!'});
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') return res.status(404).json({msg: 'Пост не найден!'});
        res.status(500).send('Server error!');
    }
});

//DELETE /api/posts/:id
//delete a post by id
router.delete('/:id',auth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id); 
        if(!post) return res.status(404).json({msg: 'пост не найден!'});
        if(post.user.toString() != req.user.id) return res.status(401).json({msg: 'Пользователь дожен быть авторизован, чтобы удалить'});

        await post.remove();
        res.json({msg: 'Пост удалён!'});

    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') return res.status(404).json({msg: 'Пост не найден!'});
        res.status(500).send('Server error!');
    }
});

//PUT /api/posts/like/:id
//like a post
router.put('/like/:id',auth,async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);

        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({msg: 'Пост уже оценён!'});
        }
        post.likes.unshift({user: req.user.id}); //put the new like at the beginning
        await post.save();
        res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error!');
    }
});

//PUT /api/posts/unlike/:id
//unlike a post
router.put('/unlike/:id',auth,async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);

        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({msg: 'Пост не был оценён!'});
        }
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex,1);

        await post.save();
        res.json(post.likes);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error!');
    }
});

//POST api/posts/comment/:id
// comment on a post
router.post('/comment/:id',
[
    auth,
    [
        check('text','text is required!').not().isEmpty()
    ]
],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array() });
    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };
        post.comments.unshift(newComment);

        await post.save();
        res.json(post.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error!');
    }
   
});

//DELETE api/posts/comment/:id/:comment_id
// delete a comment
router.delete('/comment/:id/:comment_id', auth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        if(!comment) return res.status(404).json({msg: 'комментарий не существует!'});
        if(comment.user.toString() !== req.user.id) return res.status(401).json({msg: 'пользователь не авторизован!'});
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex,1);

        await post.save();
        res.json(post.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error!');
    }
});

module.exports = router;