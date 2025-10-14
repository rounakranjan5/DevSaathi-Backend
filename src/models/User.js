const mongoose=require('mongoose')
// for data validation
const validator = require('validator');

// for generating JWT token
const jwt = require('jsonwebtoken')

// for password 
const bcrypt = require('bcrypt');



const userSchema=new mongoose.Schema({

    firstName:{
        type:String,
        required:true,
        trim:true,
        minLength:2,
        maxLength:50
    },
    lastName:{
        type:String,
        trim:true
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not Valid")
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:8,
        // maxLength:50,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Your Choosen Password is not Strong Enough")
            }
        }


    },
    age:{
        type:Number,
        required:true,
        min:18
    },
    gender:{
        type:String,
        trim:true,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender Data is not Valid")
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Photo URL is not Valid")
            }
        }

    },
    about:{
        type:String,
        default:"Hey there! I am using DevSaathi, a platform to connect with fellow developers",
        maxLength:500
    },
    skills:{
        type:[String],
        maxLength:20
    }
},
{
    timestamps:true
})


// ### schema methods ###

// not writing arrow function here beacuse i want to use 'this' keyword

userSchema.methods.getJWTToken=async function(){
    const user=this;
    const token=await jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })

    return token;
}


userSchema.methods.passwordValidation=async function(userEnteredPassword){
    const user=this;
    const isPasswordValid = await bcrypt.compare(userEnteredPassword, user.password);
    return isPasswordValid;
}

const userModel=mongoose.model("User",userSchema)

module.exports=userModel