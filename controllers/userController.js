const {matchedData, validationResult} = require("express-validator");
const {register} = require("../services/handlers/userHandler");
const { user } = require("pg/lib/defaults");
const { initialVerifyMailProcess, processMailVerification } = require("../services/handlers/mailHandler");

exports.register = async(req, res, next) => {
    const validation = validationResult(req);
    if(!validation.isEmpty()){
        return res.status(400).json({success:false, message:"request data is not valid", errors:validation.array()})
    }
    const {username, email, password} = matchedData(req);
    const response = await register(username, email, password);
    if(response.success){
        console.log(response.data);
        if(response.message === null){
            res.json({success:true, message:"created account but failed to initiate mail verification"})
        }
        return res.status(200).json({success:true, message:"successfully created the user, awaiting email verification", data:response.data})

    }
    if(response.message === "exists"){
        return res.json({success:false, message:"User already exists, please verify and login"}).status(400)
    }
    res.status(400).json({success:false, message:"Failed to process request"})
}

exports.verifyEmail = async(req, res, next) => {
    const {token} = req.query;
    const {success, message} = await processMailVerification(token);
    if(success){
        return res.json({success, message:"successfully verified email"}).status(200)
    }
    return res.json({success:false, message}).status(400);
}