import sendEmail from "../services/sendMail.js";

export async function email(req,res){
    try {
        const {to, subject, text} = req.body;
        const info = await sendEmail(to, subject, text);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error.message);
        return res.sendStatus(500);
    }
}