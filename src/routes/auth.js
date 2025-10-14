const { validateSignUpData } = require("../utils/validation");
const bcrypt=require('bcrypt');
const User=require('../models/User');
const jwt = require("jsonwebtoken");
const express=require('express')
const router=express.Router();

router.post('/signup',async(req,res)=>{
    try{
        // data validation
        validateSignUpData(req);

        // extract all the fields from req.body
        const { firstName, lastName, emailId, password, age, gender, skills, photoUrl, about } = req.body;

        // password encryption
        const passwordHash=await bcrypt.hash(password,10);

        const user=new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash,
            age,
            gender,
            skills,
            photoUrl,
            about
        })
        

        const signUpUser=await user.save();

        const token=await signUpUser.getJWTToken();

        res.cookie('token',token,{
            expires: new Date(Date.now() + 24 * 7 * 3600000)
        })
        

        res.json({
            message:"user added successfully",
            data:signUpUser
        })

    }
    catch(err){
        res.status(400).send("unsuccessfull user Addition : "+err.message)
    }
})

router.post('/login',async (req,res)=>{
    try{
        const {emailId,password}=req.body;

        const user=await User.findOne({emailId:emailId})

        if(!user){
            return res.status(404).send("User doesn't exist")
        }

        // const isPasswordValid=await bcrypt.compare(password,user.password)

        // offloading the isPasswordValid to User schema]
        const isPasswordValid=await user.passwordValidation(password)

        if(isPasswordValid){
            // const token= await jwt.sign({_id: user._id},process.env.JWT_SECRET_KEY,{
            //     expiresIn: "7d"
            // })

            // offloading the token to userSchema
            const token=await user.getJWTToken();

            res.cookie('token', token, {
                expires: new Date(Date.now() + 24 * 7 * 3600000)
            })

            res.json({
                message:"Login Successful",
                data:user
            })

        }else{
            throw new Error("Invalid Credentials")
        }
    }
    catch(err){
        res.status(400).send("Unsuccessfull User Login : "+err.message)
    }
})

router.post('/logout',(req,res)=>{
    res.cookie('token',null,{
        expires: new Date(Date.now())
    })

    res.json({
        message:"Logout Successfully"
    })

})

module.exports=router;