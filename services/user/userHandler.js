const { user } = require("pg/lib/defaults");
const pool = require("../../config/db");
const crypto = require("crypto");
const { encrypt } = require("../../utils/hashPassword");
const {initialVerifyMailProcess} = require("./mailHandler");

const userExists = async (username, email) => {
  try {
    let output = false;
    const usernameReponse = await pool.query(
      `SELECT EXISTS ( SELECT 1 FROM student WHERE username='${username}' )`,
    );
    const emailResponse = await pool.query(
      `SELECT EXISTS ( SELECT 1 FROM student WHERE email='${email}' )`,
    );
    const usernameExists = usernameReponse.rows[0].exists;
    const emailExists = emailResponse.rows[0].exists;
    if (usernameExists) {
      output = true;
    }
    if(emailExists){
      output = true;
    }
    return output;
  } catch (e) {
    throw new Error(`Failed to verify user with the exception: ${e}`);
  }
};

const fullUserExists = async(username, email) => {
  try{
    const response = await pool.query(`SELECT EXISTS ( SELECT 1 FROM student WHERE username= '${username}' AND email='${email}' )`,
    );
    const exists = response.rows[0].exists;
    if(exists){
      return true;
    }
    return false;
  }
  catch(e){
    throw new Error(`Failed to verify full user existance with the following exception: ${e}`)
  }
}

const create = async (username, email, password) => {
  const client = await pool.connect()
  try {
    await client.query("BEGIN");
    const status = "pending";
    created_at = String(new Date().toISOString());
    updated_at = String(new Date().toISOString());
    const token = crypto.randomUUID();
    const tokenExpiry = new Date( Date.now() + 24*60*60*1000).toISOString();
    const { rowCount, rows } = await client.query(
      `INSERT INTO student(username, email, password, status, created_at, updated_at, token, token_expiry) VALUES('${username}', '${email}', '${password}','${status}', '${created_at}', '${updated_at}', '${token}', '${tokenExpiry}') RETURNING username, email, token`,
    );
    if (rowCount === 1) {
      const {username, email, token} = rows[0];
      const {success, message} = await initialVerifyMailProcess(username, email, token)
      if(success){
        await client.query("COMMIT");
      return { success: true, message:"Successfully created user", data:rows[0] };
      a
      }
      await client.query("ROLLBACK");
      return {success:false, message:"Error when sending email", data:rows[0]}
    } 
    await client.query("ROLLBACK");
    return { success: false, message: "Error writing in student table", data:null };
  } catch (e) {
    await client.query("ROLLBACK");
    throw new Error(`Caught an exception while creating user: ${e}`);
  }
};

const updateToken = async(username, email, token, tokenExpiry) => {
  try{
    const {rows, rowCount} = await pool.query(`UPDATE student SET token='${token}', token_expiry='${tokenExpiry}' WHERE username='${username}' AND email='${email}';`,
    )
    if(rowCount === 1){
        return {
          suceess:true,
          message:"updated"
        }
    }
    return {
      success:false,
      message:"Failed to update token due to an unhandled exception"
    }
  }
  catch(e){
    throw new Error(`Encountered an exception when updating token: ${e}`)
  }
}

exports.register = async (username, email, password) => {
  try {
    const exists = await userExists(username, email);
    if (exists) {
      return {
        success: false,
        message: "exists",
      };
    }
    const hashed_password = await encrypt(password);
    const results = await create(username, email, hashed_password);
    return results;
  } catch (e) {
    throw new Error(`Caught an exception while registering user: ${e}`);
  }
};

exports.processUpdateToken = async(payload) => {
  const {username, email, token, tokenExpiry} = payload;
  const exists = await fullUserExists(username, email);
  if(!exists){
    return {success:false, message:"User does not exist"}
  }
  const {success, message} = await updateToken(username, email, token, tokenExpiry);
  if(success){
    return {success, message}
  }
  return {
    success:false,
    message:"Failed to update token due to an unhandled exception"
  }
}
