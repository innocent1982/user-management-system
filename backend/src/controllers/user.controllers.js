import pool from "../config/db.config.js";
import { validationResult, matchedData } from "express-validator";

export const get = async(req, res, next) => {
    const {id, email} = req.user;
    try{
        const {rows, rowCount} = await pool.query(`SELECT username, email, role, created_at FROM users WHERE id=$1 AND email=$2`, [id, email]);
        if(rowCount !== 1){
            const err = new Error("database query could not return desired output");
            err.code = "DB-1"
            throw err;
        }
        const data = rows[0];
        return res.status(200).json({
            success:"true",
            message:"User data retrieved",
            data:data
        });
    }
    catch (error) {
        next(error)
    }
}

export const updateUser = async(req, res, next) => {
    const validation = validationResult(req);
    if(!validation.isEmpty()){
        const err = new Error("validation error");
        err.code = "VAL-1";
        err.validationErrors = validation.array();
        return next(err);
    }
    if(Object.keys(req.body).length === 0){
        return res.status(400).json({success:false, message:"Valid updates not provided"})
    }
    const data = matchedData(req);
    const allowedFields = ["username", "email", "password"];
    const updates = {}
    for(let key of allowedFields){
        if(data[key] !== undefined){
            updates[key] = data[key]
        }
    }
    if(Object.keys(updates).length === 0){
        return res.status(400).json({success:true, message:"No valid update fields provided"});
    }
    const userId = req.user.id;
    const fields = Object.keys(updates)
    const values = Object.values(updates)
    const queryFields = fields.map((field,i) => {return `${field} = $${i +1}`}).join(", ");
    console.log(values)
    const query = `UPDATE users SET ${queryFields} WHERE id=$${fields.length + 1} RETURNING *`
    try{
        const {rows, rowCount} = await pool.query(query, [...values, userId])
        if (rowCount !== 1){
            const error = new Error("Failed to run a patch request on user")
            next(error);
        }
        const fields = rows[0]
        return res.status(201).json({success:true, message:"user successfully updated", data:fields});
    }catch(error){
        next(error)
    }
}

export const deleteUser = async(req, res, next) => {
    const userId = req.user.id;
    try{
        const {rowCount} = await pool.query(`UPDATE users SET deleted_at = NOW() WHERE id=$1`, [userId]);
        if(rowCount !== 1){
            const error = new Error("Failed to delete user");
            next(error);
        }
        return res.status(200).json({success:true, message:"User successfully deleted"})
    }
    catch(error){
        next(error)
    }
}   