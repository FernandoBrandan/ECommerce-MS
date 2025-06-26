import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const transporter = createTransport({
    host: 'smtp.gmail.com', 
    port: 587,               
    secure: false,           
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,   
    },
});

async function sendEmail(to, subject, text) {
    try {
        const info = await transporter.sendMail({
            from: `"EComm-scalable" ${process.env.GMAIL}`,
            to,
            subject,
            text,                                         
        });
        return info;

    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export default sendEmail;
