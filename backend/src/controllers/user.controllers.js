import pool from "../config/db.config";

exports.get = async(req, res, next) => {
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

exports.put = async(req, res, next) => {
    const {username, email} = req.body;
    
}
