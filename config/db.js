const {Pool} = require("pg");
const { password, database } = require("pg/lib/defaults");

const pool = new Pool({
    user:"admin",
    password:"admin",
    host:"localhost",
    port:5432,
    database:"notes"
})

module.exports = pool;