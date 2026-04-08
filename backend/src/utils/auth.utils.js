import jwt from "jsonwebtoken";
import { redisClient } from "../config/redis.config.js";

export const createTokens = async (id, email) => {
    try{
        const access = jwt.sign({userId:id, userEmail:email}, process.env.JWT_SECRET, {expiresIn:"10m"});
        const refresh = jwt.sign({userId:id, userEmail:email}, process.env.JWT_SECRET, {expiresIn:"1d"});
        const response = await redisClient.set(`refresh-${id}`, refresh, {EX: 24 * 60 * 60});
        if(response !== "OK") {
            throw new Error("Failed to cache access token")
        }
        return {
            access,
            refresh
        }

    } catch (error) {
        throw new Error(`Error in create tokens util: ${error}`);
    }
};
