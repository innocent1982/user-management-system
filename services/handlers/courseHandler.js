const pool = require("../../config/db");

exports.create = async(input) => {
    const {name, description, level} = input;
    const exists = checkExistence(name);
    if(exists){
        return {success:false, message:"exists"}
    }
    try{
        const {rowCount, rows} = await pool.query(`INSERT INTO course(name, description, level) VALUES($1, $2, $3) RETURNING *`, [name, description, level]);
        if(rowCount === 0){
            return {success:false, message:"failed to create course", data:rows[0]}
        }
        return {success:true, message:"course created successfully", data:rows[0]};
    }
    catch(e){
        throw new Error(`Caught an exception while creating course: ${e}`)
    }
}

const checkExistence = async(name) => {
    try{
        const {rows} = await pool.query(`SELECT EXISTS ( SELECT 1 FROM course WHERE name=$1)`, [name]);
        if(rows[0].exists){
            return true
        }
        return false
    }
    catch(e){
        throw new Error(`Caught an exception while verifying course existence: ${e}`)
    }
}