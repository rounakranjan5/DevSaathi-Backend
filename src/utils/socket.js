const socket = require('socket.io')
const ChatModel = require('../models/Chat')
const crypto=require('crypto')

const getSecretRoomId=(userId,targetUserId)=>{  
    return crypto.createHash('sha256').update([userId,targetUserId].sort().join('$')).digest('hex')
};

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: process.env.FRONTEND_ORIGIN,
        }
    })

    io.on('connection', (socket) => {

        socket.on('joinChat', ({ firstName, userId, targetUserId }) => {
            // console.log(userId,targetUserId)
            const roomId = getSecretRoomId(userId,targetUserId)
            // console.log(firstName + " joined  room: " + roomId);
            socket.join(roomId)
        })

        socket.on('sendMessage', async ({ message, userId, targetUserId, firstName, photoUrl }) => {
            try {
                const roomId = getSecretRoomId(userId,targetUserId)
                // console.log(firstName + ": " + message);

                let chat = await ChatModel.findOne({
                    participants: { $all: [userId, targetUserId] }
                })

                if(!chat){
                    chat=new ChatModel({
                        participants:[userId,targetUserId],
                        messages:[]
                    })
                }

                chat.messages.push({
                    senderId: userId,
                    text: message
                })

                await chat.save()

                io.to(roomId).emit('messageReceived', {
                    message,
                    userId,
                    targetUserId,
                    firstName,
                    roomId,
                    createdAt: new Date(),
                    photoUrl
                })
            }
            catch(err){
                console.log(err)
            }
        })

        socket.on('disconnect', () => {

        })


    })


}

module.exports = initializeSocket;