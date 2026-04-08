import crypto from "crypto";
import { matchedData, validationResult } from "express-validator";
import pool from "../config/db.config.js";
import {
  loginUser,
  logoutUser,
  refreshUserTokens,
  register as registerUser,
  userExists,
  verifyEmail,
} from "../services/auth.services.js";
import { encrypt } from "../utils/hashPassword.js";
import { initiateEmailVerification, validate_token } from "../utils/mail.utils.js";

export const register = async (req, res, next) => {
    try{
    const validation = validationResult(req);
    if(!validation.isEmpty()){
        return res.status(400).json({success:false, message:"request data is not valid", errors:validation.array()})
    }
    const {username, email, password} = matchedData(req);
    const response = await registerUser(username, email, password);
    if(response.success){
        console.log("Controller responding")
        return res.status(201).json({success:true, message:response.message, data:response.data})
    }
    return res.status(400).json({success:false, message:response.message, data:response.data})
    } catch (error){
        if(error.code === "23505"){
            console.log("Unique constraint violation:", error.detail);
            return res.status(400).json({success:false, message:"user with the provided email or username already exists"})
        }
        next(error);
    }
};

export const verify = async (req, res, next) => {
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
};

export const login = async (req, res, next) => {
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
};

export const logout = async (req, res, next) => {
    const {id, token} = req.user;
    try{
    const {success, message} = await logoutUser(id, token);
    if(!success){
        return res.status(400).json({success:false, message})
    }
    return res.status(201).json({success, message})
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    const {id, email, token} = req.user;
    try{
    const {success, message, token:refreshedToken} = await refreshUserTokens(id, email, token);    
    return res.status(201).json({success, message, token:refreshedToken});
    } catch (error) {
        next(error)
    }
};

export const forgotPassword = async (req, res, next) => {
    const validation = validationResult(req);
    if(!validation.isEmpty()){
        return res.status(400).json({success:false, message:"validation error", data:validation.array})
    }
    const {email} = matchedData(req);
    try{
        const output = await userExists({email});
        if(Object.keys(output).length === 0){
            return res.status(200).json({success:false, message:"user with the provided email does not exist"})
        }
        const token = crypto.randomUUID();
        const token_expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); 
        const {rowCount} = await pool.query(`UPDATE users SET token=$1, token_expiry=$2 WHERE email=$3`, [token, token_expiry, email]);
        if(rowCount !== 1){
            return res.status(500).json({success:false, message:"error setting up password reset"})
        }
        const endpoint = `http://127.0.0.1:5000/users/reset-password/`
        const {success, message} = await initiateEmailVerification(email, token, endpoint);
        if(success){
            return res.status(200).json({success, message});
        }
        return res.status(200).json({success:false, message});
    }
    catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    const {token, new_password} = req.body;
    if(!token || !new_password){
        return res.status(400).json({success:false, message:"token and new password are required"})
    }
    try{
        const {rows, rowCount} = await pool.query(`SELECT id, token_expiry FROM users WHERE token=$1`, [token]);
        if(rowCount !== 1){
            return res.status(400).json({success:false, message:"invalid token"})
        }
        const {id, token_expiry} = rows[0];
        if(validate_token(token_expiry)){
            return res.status(400).json({success:false, message:"token has expired"})
        }
        const hashed_password = await encrypt(new_password);
        const {rowCount:updateCount} = await pool.query(`UPDATE users SET password=$1, token=null, token_expiry=null WHERE id=$2`, [hashed_password, id]);
        if(updateCount !== 1){
            return res.status(500).json({success:false, message:"error resetting password"})
        }
        return res.status(200).json({success:true, message:"password reset successfully"})
    } catch (error) {
        next(error);
    }
};
