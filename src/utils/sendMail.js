const nodemailer=require("nodemailer");
const User = require("../models/User");
require('dotenv').config()
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
        user: process.env.DEVSAATHI_EMAIL, 
        pass: process.env.DEVSAATHI_EMAIL_APP_PASSWORD, 
    },
});

const mailContent= async (fromUserId, toUserId) => {
    // console.log(fromUserId,toUserId);
    try {
        // Send email 
        const toUserIdUser=await User.findById(toUserId)
        const fromUserIdUser=await User.findById(fromUserId)

        if(!toUserIdUser || !fromUserIdUser){
            throw new Error("User not found")
        }

        const info = await transporter.sendMail({
            from: `"devSaathi🤝" <${process.env.DEVSAATHI_EMAIL}>`, // Sender address
            to: toUserIdUser.emailId, // Recipient email
            subject: "New Connection Request - devSaathi🤝", // Subject line
            text: `You've Got a Connection Request from ${fromUserIdUser.firstName} ${fromUserIdUser.lastName}`, // Plain text body
             html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>New Connection Request!</h2>
                    <p>Hi ${toUserIdUser.firstName},</p>
                    <p>You've received a new connection request from <strong>${fromUserIdUser.firstName} ${fromUserIdUser.lastName}</strong> on devSaathi.</p>
                    <p>Login to your account to view and respond to this request.</p>
                    <br>
                    <p>Best regards,<br>devSaathi Team 🤝</p>
            </div>`
        });

        // console.log(`Message sent: ${info.messageId}`);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
    }
};

module.exports = mailContent;