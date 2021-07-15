require("dotenv").config();
const Pool = require("pg").Pool;
const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DBNAME,
    password: process.env.DATABASE_PASSWORD
});

module.exports = {
    query: function (text, ...args) { return pool.query(text, ...args) },
    pool
};