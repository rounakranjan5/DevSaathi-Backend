const express=require('express')
const ChatModel = require('../models/Chat')
const { userAuth } = require('../middlewares/auth')

const router=express.Router()

router.get('/chat/:targetUserId',userAuth,async(req,res)=>{
    const targetUserId=req.params.targetUserId
    const userId=req.user._id

    try{
        if(!targetUserId){
            return res.status(400).json({error:"targetUserId is required"})
        }
        let chat=await ChatModel.findOne({
            participants: { $all: [userId, targetUserId] }
        }).populate({
            path:"messages.senderId",
            select:"firstName lastName photoUrl"
        })

        if(!chat){
            chat=new ChatModel({
                participants:[userId,targetUserId],
                messages:[]
            })
            await chat.save()
        }
        res.status(200).json(chat)
    }
    catch(err){
        console.error(err)
        res.status(500).json({error:"Internal Server Error" + err.message})
    }
})

module.exports=router