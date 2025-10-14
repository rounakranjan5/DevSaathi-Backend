const jwt = require('jsonwebtoken')
const User = require('../models/User')
const userAuth = async (req, res, next) => {

    try {
        const cookies = req.cookies;
        // console.log("cookies in auth middleware",cookies);
        const token = cookies.token;
        // console.log("token in auth middleware",token);
        if (!token) {
            return res.status(401).send("Token not found")
        }

        const decodedMsg = jwt.verify(token, process.env.JWT_SECRET_KEY)
        // console.log("decodedMsg in auth middleware",decodedMsg);
        const { _id } = decodedMsg;
        // console.log("_id in auth middleware",_id);
        const user = await User.findById(_id)
        req.user = user
        // console.log("user in auth middleware",user);
        next()
    }
    catch (err) {
        res.status(400).send("something went wrong " + err.message)
    }
}

module.exports = {
    userAuth
}