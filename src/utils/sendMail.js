const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.DEVSAATHI_EMAIL,
        pass: process.env.DEVSAATHI_EMAIL_APP_PASSWORD,
    },
});

const sendEmail = {
    run: async (to, subject, message) => {
        try {
            const info = await transporter.sendMail({
                from: `"devSaathi🤝" <${process.env.DEVSAATHI_EMAIL}>`,
                to: to,
                subject: subject,
                text: message,
                html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>devSaathi 🤝</h2>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                </div>`
            });
            
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error("Email sending failed:", error);
            throw error;
        }
    }
};

module.exports = sendEmail;