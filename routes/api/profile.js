const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Post = require('../../models/Post');
const {validationResult} = require('express-validator');

//GET api/profile/me
//get my profile
router.get('/me',auth,async(req,res)=>{
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user',['name','avatar']);
        if(!profile) return res.status(400).json({msg: 'there is no profile for this user!'});
        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

//POST api/profile
//post new profile or update existing one
router.post('/',auth,
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    const {
        location,
        bio,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;
    const profileFields = {};
    profileFields.user = req.user.id;
    if(location) profileFields.location=location;
    if(bio) profileFields.bio=bio;
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    try{
        let profile = await Profile.findOne({user: req.user.id});
        if(profile){
            profile = await Profile.findOneAndUpdate({user: req.user.id} , {$set : profileFields} , {new: true});
            return res.json(profile);
        }

        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error!');
    }
});

//GET api/profile
//get all profiles
router.get('/', async (req,res)=>{
    try {
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error!');
    }
});

//GET api/profile/user/:user_id
//get profile by user id
router.get('/user/:user_id', async (req,res)=>{
    try {
        const profile = await Profile.findOne({user : req.params.user_id}).populate('user',['name','avatar']);
        if(!profile) return res.status(400).json({msg: 'Профиль не найден!'});
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') return res.status(400).json({msg: 'Профиль не найден!'});
        res.status(500).send('Server error!');
    }
});

// DELETE api/profile
//delete profile
router.delete('/',auth, async (req,res)=>{
    try {
        //remove posts from that user
        await Post.deleteMany({ user: req.user.id});
        
        await Profile.findOneAndRemove({user : req.user.id});
        
        await User.findByIdAndRemove({_id: req.user.id});
        res.json({msg: 'Пользователь удален!'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error!');
    }
});


module.exports = router;