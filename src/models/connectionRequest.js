const mongoose = require('mongoose');

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    status:{
        type:String,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`
        }
    }
},
{
    timestamps:true
})


// indexing -> to make search faster
connectionRequestSchema.index({fromUserId:1,toUserId:1})
// 1 means asc order , -1 means desc order


// handling sending connection request to yourself
// pre save hooks -> called before saving a document
// never write arrow function here because we need 'this' keyword which points to current document being saved and in arrow function 'this' keyword points to outer scope i.e.
connectionRequestSchema.pre('save',async function(next){
    const connectionRequest=this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You cannot send connection request to yourself")
    }
    next()
})

const ConnectionRequestModel=mongoose.model("ConnectionRequest",connectionRequestSchema)

module.exports=ConnectionRequestModel;