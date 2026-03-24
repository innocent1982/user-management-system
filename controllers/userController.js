const {matchedData, validationResult} = require("express-validator");
const {register, loginUser} = require("../services/handlers/userHandler");
const { user } = require("pg/lib/defaults");
const { initialVerifyMailProcess, processMailVerification } = require("../services/handlers/mailHandler");

exports.register = async(req, res, next) => {
    try{
    const validation = validationResult(req);
    if(!validation.isEmpty()){
        return res.status(400).json({success:false, message:"request data is not valid", errors:validation.array()})
    }
    const {username, email, password} = matchedData(req);
    const response = await register(username, email, password);
    if(response.success){
        return res.status(201).json({success:true, message:response.message, data:response.data})
    }
    return res.status(400).json({success:false, message:response.message, data:response.data})
    } catch (error){
        next(error);
    }
}

exports.verify = async(req, res, next) => {
    const {token} = req.query;
    try{
        const {success, message} = await verifyEmail(token);
        if(success){
            return res.status(201).json({success, message:"successfully verified email"})
        }
        return res.status(400).json({success:false, message});
    } catch (error){
        next(error);
    }
}

exports.login = async(req, res, next) => {
    const validation = validationResult(req);
    if(!validation.isEmpty()){
        return res.status(400).json({success:false, message:"request data is not valid", errors:validation.array()})
    }
    const {email, password} = matchedData(req);
    try{
        const {success, message, data} = await loginUser(email, password);
        if(success){
            return res.status(200).json({success, message, tokens:data})
        }
        return res.status(400).json({success:false, message});
    } catch (error){
        next(error);
    }
}