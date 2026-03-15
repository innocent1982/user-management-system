const {matchedData, validationResult} = require("express-validator");
const {create} = require("../services/handlers/courseHandler");

exports.createCourse = async(req, res, next) => {
    const validation = validationResult(req);
    if(!validation.isEmpty()){
        res.json({success:false, message:"input validation failed", data:validation.array()}).status(400)
    }
    const validated_data =  matchedData(req);
    const {success, message, data} = await create(validated_data);
    if(message === "exists"){
        return res.json({success:false, message:"Course already exists"}).status(400)
    }
    if(success){
        return res.json({success:true, message, data}).status(200)
    }
    res.json({success:false, message}).status(400)
}