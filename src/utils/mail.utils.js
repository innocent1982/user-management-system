
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const pool = require("../../config/db");
const jwt = require("jsonwebtoken");

exports.initiateEmailVerification = async(email, token) => {
    const subject = `Verify email address`
    const text = `Please click the following link to verify your email: ${`http:??127.0.0.1:3000/student/verify-email?token=${token}`}`
    const html = `
    <p>Hello,</p>
    <p>Please clink the link below to verify your email address</p>
    <a href=${`http:??127.0.0.1:3000/student/verify-email?token=${token}`}>Verify Email</a>
    `
    const {success, message} = await sendMail(email, subject, text,html);
    return {success, message}
} 


const validate_token = (token_expiry) => {
    const now = new Date();
    const expiryDate = new Date(token_expiry);
    return now > expiryDate;
}

exports.verifyEmail = async (token) => {
        const {rows} = await pool.query(`SELECT id, token_expiry FROM student WHERE token='${token}'`);
        if(rows.length !== 1){
            return {
                success:false,
                message:"invalid token"
            }
        } 
        const timestamp = new Date().toISOString();
        const {id, token_expiry} = rows[0];
        const token_expired = validate_token(token_expiry);     
        if(token_expired){
            return{
                success:false,
                message:"token expired"
            }
        }            
        const response = await pool.query(`UPDATE student SET verified=true, token=NULL, updated_at=$1 WHERE id=$2 RETURNING id, email`, [timestamp, id]);
        console.log(response);
        if(response.rowCount === 1){
            const {id, email} = response.rows[0];
            try{
            const token = jwt.sign({userId:id, userEmail:email}, process.env.JWT_KEY, {expiresIn:"1hr"});
            return {
                success:true,
                mesasge:"successsfully verified the user",
                token:token
            } 
            } catch (error) {
                throw new Error("Error while generating jwt token")
            }
        }
        return {
            success:false,
            message:"Error while verifying user"
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