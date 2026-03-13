const {processUpdateToken} = require("./userHandler");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const pool = require("../../config/db");

exports.initialVerifyMailProcess = async(username, email, token) => {
    console.log(token);
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
    } catch (e) {
        throw new Error(`Caught an exception while sending mail`)
    }
    

}

exports.processMailVerification = async (token) => {

    try{
        const {rowCount, rows} = await pool.query(`SELECT (username, email, token_expiry) FROM student WHERE token='${token}'`);
        if(rowCount === 1){
                const timestamp = new Date().toISOString();
                const {username, email, token_expiry} = rows[0];
                if(token_expiry > Date(new Date() + 60 * 60 * 1000)){
                    return{
                        success:false,
                        message:"token expired"
                    }
                }
                try{
                const {rowCount} = await pool.query(`ALTER STUDENT SET verified=false, updated_at='${timestamp}' WHERE username='${username}' AND email='${email}'`);
                if(rowCount === 1){
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
    const transporter = nodemailer.createTransporter({
        port:587,
        secure:false,
        host:"smtp.gmail.com",
        auth:{
            user:"innocentkamesa)%@gmail.com",
            pass:"@Innocent123kamesa"
        }
    })
    const {accepted} = await transporter.sendMail({
        from:"innocentkamesa05@gmail.com",
        to:email,
        subject:subject,
        text:text,
        html:html
    })
    if(accepted.isEmpty){
        return {success:false, message:"email not sent"}
    }
    return {success:true, message:"email sent"}

}