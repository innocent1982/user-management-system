import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
    user:"admin",
    password:"admin",
    host:"localhost",
    port:5432,
    database:"usermanagement"
});

export default pool;
