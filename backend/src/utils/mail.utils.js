import nodemailer from "nodemailer";

export const initiateEmailVerification = async (email, token, endpoint, isTest) => {
    if(isTest){
        return {success:true, message:"email sent:Test mode"};
    }
    const subject = `Verify email address`;
    const text = `Please click the following link to verify your email: ${endpoint}${token}`;
    const html = `
    <p>Hello,</p>
    <p>Please clink the link below to verify your email address</p>
    <a href=${endpoint}${token}>Verify Email</a>
    `;
    const {success, message} = await sendMail(email, subject, text,html);
    return {success, message};
};


export const validate_token = (token_expiry) => {
    const now = new Date();
    const expiryDate = new Date(token_expiry);
    return now > expiryDate;
};

const sendMail = async(email, subject, text, html) => {
    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,   
        auth: {
            user: process.env.GMAIL_USER,
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
