const { user } = require("pg/lib/defaults");
const pool = require("../config/db.config");
const crypto = require("crypto");
const { encrypt } = require("../utils/hashPassword");
const { initiateEmailVerification, validate_token } = require("../utils/mail.utils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {redisClient} = require("../config/redis.config");
const {createTokens} = require("../utils/auth.utils")


exports.userExists = async (fields) => {
  let output = {};
  for (const key in fields) {
    const value = fields[key];
    const response = await pool.query(
    `SELECT EXISTS ( SELECT 1 FROM users WHERE '${key}'='${value}' )`,
    );
    if(response.rows[0].exists){
        output[key] = `${key} exists`;
    }
  }
  return output;
};

const create = async (username, email, password) => {
  const client = await pool.connect();
    await client.query("BEGIN");
    const role = "classic";
    created_at = String(new Date().toISOString());
    updated_at = String(new Date().toISOString());
    const token = crypto.randomUUID();
    const tokenExpiry = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ).toISOString();
    const { rowCount, rows } = await client.query(
      `INSERT INTO users(username, email, password, role, created_at, updated_at, token, token_expiry) VALUES('${username}', '${email}', '${password}','${role}', '${created_at}', '${updated_at}', '${token}', '${tokenExpiry}') RETURNING username, email, token`,
    );
    if (rowCount === 1) {
      const { email, token } = rows[0];
      const responseEndpoint = "http://127.0.1:3000/student/verify-email?token=";
      const { success, message } = await initiateEmailVerification(
        email,
        token,
        responseEndpoint
      );
      if (success) {
        await client.query("COMMIT");
        return {
          success,
          message: `Email sent successfully, open inbox and verify`,
          data: rows[0],
        };;
      }
      await client.query("ROLLBACK");
      return {
        success: false,
        message: "Error when sending email",
        data: rows[0],
      };
    }
    await client.query("ROLLBACK");
    return {
      success: false,
      message: "Error writing in student table",
      data: null,
    };
};

exports.register = async (username, email, password) => {
    const output = await userExists({username, email});
    if (Object.keys(output).length > 0) {
      return {
        success: false,
        message: "exists",
        data:output
      };
    }
    const hashed_password = await encrypt(password);                                                
    const results = await create(username, email, hashed_password, isTest);
    return results;
};

exports.loginUser = async (email, password) => {
  const {rows, rowCount}  = await pool.query(`SELECT id, email, password FROM users WHERE email=$1`, [email]);
  if(rowCount !== 1){
    return {
      success:false,
      message:"User not found"
    }
  }
  const {id, email:userEmail, password:hashedPassword} = rows[0];
  const passwordMatched = await bcrypt.compare(password, hashedPassword);
  if(!passwordMatched){
    return {
      success:false,
      message:"Incorrect password"
    }
  }
  const {access, refresh} = await createTokens(id, userEmail);
    return {
      success:true,
      message:"Login successful",
      data:{
        access,
        refresh
      }
    }
  }

exports.verifyEmail = async (token) => {
        const {rows} = await pool.query(`SELECT id, token_expiry FROM users WHERE token='${token}'`);
        const client = await pool.connect();
        await client.query("BEGIN");
        if(rows.length !== 1){
            return {
                success:false,
                message:"invalid token"
            }
        } 
        const timestamp = new Date().toISOString();
        const {id, token_expiry} = rows[0];
        const token_expired = validate_token(token_expiry);     
        if(token_expired){
          await client.query("ROLLBACK");
            return{
                success:false,
                message:"token expired"
            }
        }            
        const response = await client.query(`UPDATE users SET is_verified=true, token=NULL, token_expiry=NULL, updated_at=$1 WHERE id=$2 RETURNING id, email`, [timestamp, id]);
        console.log(response);
        if(response.rowCount === 1){
            await client.query("COMMIT");
            return {
                success:true,
                message:"successfully verified the user",
            } 
            }
        return {
            success:false,
            message:"Error while verifying user"
        }
    }

exports.logoutUser = async(id, email, token) => {
  const response = await redisClient.del(`refresh-${id}`);
  if(response !== 1){
    return {
      success:false,
      message:"failed to logout: Key does not exist"
    }
  }
  return{
    success:true,
    message:"Logout successful"
  }
}

exports.refreshUserTokens = async(id, email, token) => {
  const stored  = await redisClient.get(`refresh-${id}`);
  if(stored === null || stored !== token) {
    return {
      success:false,
      message:"Invalid refresh token"
    }
  }
  const access = jwt.sign({userId:id, userEmail:email}, process.env.JWT_SECRET, {expiresIn:"10m"});
  return{
    success:true,
    message:"Tokens refreshed successful",
    token:access
  }
}