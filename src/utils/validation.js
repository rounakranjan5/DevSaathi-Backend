const validator = require('validator');

const validateSignUpData=(req)=>{
    const {firstName, lastName, emailId, password}= req.body;

    if(!firstName || !lastName){
        throw new Error("First Name and Last Name are required");   
    }

    else if(!validator.isEmail(emailId)){ 
        throw new Error("Email is not valid");
    }

    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }
}

const validateProfileEditData=(req)=>{
    const allowedEdits=[
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoUrl",
        "skills",
        "about"
    ]

    const isReqFieldEditable=Object.keys(req.body).every((key)=>allowedEdits.includes(key))

    if(req.body.skills && req.body.skills.length>20) return false
    if(req.body.about && req.body.about.length>500) return false


    return isReqFieldEditable
}

module.exports={
    validateSignUpData,
    validateProfileEditData
}