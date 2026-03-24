const { user } = require("pg/lib/defaults");
const pool = require("../../config/db");
const crypto = require("crypto");
const { encrypt } = require("../../utils/hashPassword");
const { initiateEmailVerification } = require("./mailHandler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userExists = async (fields) => {
  let output = {};
  for (const key in fields) {
    const value = fields[key];
    const response = await pool.query(
    `SELECT EXISTS ( SELECT 1 FROM student WHERE '${key}'='${value}' )`,
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
    const status = "pending";
    created_at = String(new Date().toISOString());
    updated_at = String(new Date().toISOString());
    const token = crypto.randomUUID();
    const tokenExpiry = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ).toISOString();
    const { rowCount, rows } = await client.query(
      `INSERT INTO student(username, email, password, status, created_at, updated_at, token, token_expiry) VALUES('${username}', '${email}', '${password}','${status}', '${created_at}', '${updated_at}', '${token}', '${tokenExpiry}') RETURNING username, email, token`,
    );
    if (rowCount === 1) {
      const { email, token } = rows[0];
      const { success, message } = await initiateEmailVerification(
        email,
        token,
      );
      if (success) {
        await client.query("COMMIT");
        return {
          success,
          message: `Email sent successfully, open inbox and verify`,
          data: rows[0],
        };
        a;
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
    const output = await userExists(username, email);
    if (Object.keys(output).length > 0) {
      return {
        success: false,
        message: "exists",
        data:output
      };
    }
    const hashed_password = await encrypt(password);
    const results = await create(username, email, hashed_password);
    return results;
};

exports.loginUser = async(email, password) => {
  const {rows, rowCount}  = await pool.query(`SELECT id, email, password FROM student WHERE email=$1`, [email]);
  if(rowCount !== 1){
    return {
      success:false,
      message:"User not found"
    }
  }
  const {id, email, hashedPassword} = rows[0];
  if(!await bcrypt.compare(password, hashedPassword)){
    return {
      success:false,
      message:"Incorrect password"
    }
  }
  try{
    const access = jwt.sign({userId:id, userEmail:email}, process.env.JWT_KEY, {expiresIn:"5m"});
    const refresh = jwt.sign({userId:id, userEmail:email}, process.env.JWT_KEY, {expiresIn:"1d"});
    return {
      success:true,
      message:"Login successful",
      data:{
        access,
        refresh
      }
    }
  } catch (e) {
    throw new Error("Error while generating login tokens")
  }
}