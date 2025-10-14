const { userAuth } = require("../middlewares/auth");
const express = require('express');
const { validateProfileEditData } = require("../utils/validation");
const bcrypt=require('bcrypt')
const validator=require('validator')

const router = express.Router();

router.get('/profile/view', userAuth, (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).send("User does not exist")
        }

        res.json({
            message: "user profile fetched successfully",
            data:user
        })
    }
    catch (err) {
        res.status(400).send("something went wrong " + err.message)
    }

})

router.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid Edit request")
        }
        const loggedInUser = req.user;
        // console.log("old user",loggedInUser);

        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])

        await loggedInUser.save();
        // console.log("updated user",loggedInUser);


        res.json({
            message: `${loggedInUser.firstName} ${loggedInUser.lastName} Your profile updated successfully`,
            data:loggedInUser
        })

    }
    catch (err) {
        res.status(400).send("Pleae Note : About can't be more than 500 characters and Skills can't be more than 20 and All required fields must be filled and valid including Image URL " )
    }

})

router.patch('/profile/password',userAuth,async(req,res)=>{
    try{
        const {oldPassword,newPassword}=req.body;
        if(!oldPassword || !newPassword){
            throw new Error("Both old and new passwords are required")
        }

        const loggedInUser=req.user;
        // console.log(loggedInUser);

        const isOldPasswordValid=await loggedInUser.passwordValidation(oldPassword)
        if(!isOldPasswordValid){
            throw new Error("Old Password is Incorrect")
        }

        if(!validator.isStrongPassword(newPassword)){
            throw new Error("New Password is not strong enough try again")
        }

        loggedInUser.password=await bcrypt.hash(newPassword,10)
        await loggedInUser.save()

        res.json({
            message:`${loggedInUser.firstName} ${loggedInUser.lastName} Your Password is updated successfully`,
            data:loggedInUser
        })

    }
    catch(err){
        res.status(400).send("something went wrong " + err.message)
    }
})

module.exports = router