const cookieParser = require("cookie-parser");
const { userAuth } = require("../middlewares/auth");
const express=require('express')
const router = express.Router();
const ConnectionRequest=require('../models/connectionRequest')
const User=require('../models/User')
const mailContent=require('../utils/sendMail')



router.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        
        const {status,toUserId}=req.params;
        const fromUserId=req.user._id;

        const allowed_status=["ignored","interested"]

        if(!allowed_status.includes(status)){
            return res.status(400).json({
                message:"Invalid status type"
            })
        }

        const istoUserExists=await User.findById(toUserId)

        if(!istoUserExists){
            return res.status(404).json({
                message:"User Does not exist"
            })
        }

        const isRequestAlreadyExists=await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })

        if(isRequestAlreadyExists){
            return res.status(400).send({
                message:"Connection Request already exists"
            })
        }

        const newConnectionRequest=new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data=await newConnectionRequest.save();

        
        res.json({
            message:"connection established between "+req.user.firstName+" and "+istoUserExists.firstName,
            data
        })
        
        // if(status==="interested"){
        // mailContent(fromUserId,toUserId).then(()=>{
        //     console.log("mail sent successfully");
        // })
        // .catch((err)=>{
        //     console.error("Error in sending mail: ",err.message);
        // })
        // console.log("mail sent successfully");
        // }
    }
    catch (err) {
        res.status(400).send("something went wrong " + err.message)
    }
})


router.post('/request/review/:status/:requestId',userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const {status,requestId}=req.params;

        const allowed_status=["accepted","rejected"]

        if(!allowed_status.includes(status)){
            return res.status(400).json({
                message:"Invalid status type"
            })
        }


        const isConnectionRequestReceived=await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        })

        if(!isConnectionRequestReceived){
            return res.status(404).json({
                message:"No Connection Request Found"
            })
        }

        isConnectionRequestReceived.status=status;

        const data=await isConnectionRequestReceived.save();

        res.json({
            message:"Request "+status+" successfully",
            data
        })

    }
    catch(err){
        res.status(400).send("something went wrong " + err.message)
    }
})

module.exports = router