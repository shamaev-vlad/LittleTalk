const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const {check,validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

//GET api/auth
//get a user by id
router.get('/',auth,async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error!');
    }
});

//POST api/auth
//login user
router.post('/',
[
    check('email','Пожалуйста, введите действительный email!').isEmail(),
    check('password','Необходим парольь!').exists()
],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const { email, password } = req.body;
    try{
        let user = await User.findOne({ email });
        if(!user) return res.status(400).json({errors : [{msg: 'Неверные учетные данные!'}]});
        
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({errors : [{msg: 'Неверные учетные данные!'}]}); 

        const payload = {
            user: {
                id: user.id // like _id in mongoDB
            }
        }
        jwt.sign(payload,config.get('jwtSecret'),{expiresIn: 360000},(err,token)=>{ //decrease the expiresIn
            if(err) throw err;
            res.json({token});
        })
    

    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error!');
    }
});

module.exports = router;