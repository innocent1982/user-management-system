const {matchedData, validationResult} = require("express-validator");
const {register} = require("../services/user/userHandler");
const { user } = require("pg/lib/defaults");
const { initialVerifyMailProcess, processMailVerification } = require("../services/user/mailHandler");

exports.register = async(req, res, next) => {
    const validation = validationResult(req);
    if(!validation.isEmpty()){
        return res.status(400).json({success:false, message:"request data is not valid", errors:validation.array()})
    }
    const {username, email, password} = matchedData(req);
    const {success, message, data} = await register(username, email, password);
    if(success){
        if(message === null){
            res.json{}
        }
        return res.status(200).json({success:true, message:"successfully created the user, awaiting email verification", email:true, data:data})

    }
    if(message === "exists"){
        return res.json({success:false, message:"User already exists, please verify and login"}).status(400)
    }
    res.status(400).json({success:false, message:"Failed to process request"})
}

exports.initiateEmailVerification = async(req, res, next) => {
    const validation = validationResult(req);
    if(!validation.isEmpty()){
        return res.status(400).json({success:false, message:"request data is not valid", errors:validation.array()})
    }
    const {username, email} = matchedData(req);
    const {success, message, token} = await initialVerifyMailProcess(username, email);
    if(success){
        return res.json({success, message:"successfully sent email, waiting for verification"}).status(200)
    }
    return res.json({success:false, message:'failed to send email to user', token})
}

exports.verifyEmail = async(req, res, next) => {
    const {token} = req.query;
    const {success, message} = await processMailVerification(token);
    if(success){
        return res.json({success, message:"successfully verified email"}).status(200)
    }
    return res.json({success:false, message}).status(400);
}