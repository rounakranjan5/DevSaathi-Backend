const express = require('express')
const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')
const router = express.Router()
const User = require('../models/User')

router.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate('fromUserId', ['firstName', 'lastName', 'emailId', 'skills', 'about', 'photoUrl','age','gender'])

        // we can populate only specific fields also using this way also
        // .populate('fromUserId','firstName lastName emailId skills about photoUrl')

        res.json({
            message: "connection requests fetched successfully",
            data: connectionRequests
        })

    }
    catch (err) {
        res.status(400).send("something went wrong " + err.message)
    }
})


router.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const connections = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        })
            .populate('fromUserId', 'firstName lastName emailId skills about photoUrl gender age')
            .populate('toUserId', 'firstName lastName emailId skills about photoUrl gender age')

        const data = connections.map(connection => {
            if (connection.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return connection.toUserId
            }
            return connection.fromUserId
        })

        res.json({
            message: "connections fetched successfully",
            data
        })

    }
    catch (err) {
        res.status(400).send("something went wrong " + err.message)
    }
})

router.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const page=parseInt(req.query.page) || 1;
        let limit=parseInt(req.query.limit) || 20;

        limit=limit>50 ? 50 :limit;

        const skip=(page-1)*limit;

        const connections = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id },
                { fromUserId: loggedInUser._id }
            ]
        }).select('fromUserId toUserId')

        const hideUsersFromFeed = new Set()

        connections.forEach(connection => {
            hideUsersFromFeed.add(connection.fromUserId.toString())
            hideUsersFromFeed.add(connection.toUserId.toString())
        })

        // console.log(hideUsersFromFeed);

        const users = await User.find({
           $and:[
               {_id: { $nin:  Array.from(hideUsersFromFeed) } } ,
               {_id: { $ne: loggedInUser._id } }
           ]
        }).select('firstName lastName emailId skills about photoUrl gender age')
        .skip(skip)
        .limit(limit)

        res.json({
            data: users
        })
    }
    catch (err) {
        res.status(400).send("something went wrong " + err.message)
    }
})

module.exports = router