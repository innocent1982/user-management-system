import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    const {token} = req.body;

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {id:decoded.userId, email:decoded.userEmail, token:token}
        next();
    }
    catch(error){
        return res.status(400).json({success:false, message:"Invalid token"})
    }
};
