
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const pool = require("../../config/db");

exports.initialVerifyMailProcess = async(username, email, token) => {
    const subject = `Verify email address`
    const text = `Please click the following link to verify your email: ${`http:??127.0.0.1:3000/student/verify-email?token=${token}`}`
    const html = `
    <p>Hello,</p>
    <p>Please clink the link below to verify your email address</p>
    <a href=${`http:??127.0.0.1:3000/student/verify-email?token=${token}`}>Verify Email</a>
    `
    try{
        const {success, message} = await sendMail(email, subject, text,html);
        if(!success){
            return {success:false, message:"failed to send email"}     
        }
        return {success:true, message:"email sent successfully"}
    } catch (e) {
        throw new Error(`Caught an exception while sending mail: ${e}`)
    }
    

}

const validate_token = (token_expiry) => {
    const now = new Date();
    const expiryDate = new Date(token_expiry);
    return now > expiryDate;
}

exports.processMailVerification = async (token) => {

    try{
        const {rows} = await pool.query(`SELECT username, email, token_expiry FROM student WHERE token='${token}'`);
        if(rows.length !== 0){
                const timestamp = new Date().toISOString();
                const {username, email, token_expiry} = rows[0];
                const token_expired = validate_token(token_expiry);     
                if(token_expired){
                    return{
                        success:false,
                        message:"token expired"
                    }
                }
                try{
                const response = await pool.query(`UPDATE student SET verified=true, updated_at=$1 WHERE username=$2 AND email=$3`, [timestamp, username, email]);
                console.log(response);
                if(response.rowCount === 1){
                    return {
                        success:true,
                        mesasge:"successsfully verified the user"                    }
                }
                return {
                    success:false,
                    message:"Token valid but failed to verify the user account"
                }
            }catch(e){
                throw new Error(`While verifying user an exception was caught: ${e}`)
            }
        }
        return {
            success:false,
            message:"Token expired or user not found"
        }
    }
    catch(e){
        throw new Error(`Error caught in the email verification process: ${e}`)
    }
}

const sendMail = async(email, subject, text, html) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "innocentkamesa05@gmail.com",
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject,
        text,
        html,
    });
    if (!info.accepted || info.accepted.length === 0) {
        return {success:false, message:"email not sent"};
    }

    return {success:true, message:"email sent", info};
};