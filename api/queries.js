const Pool = require("pg").Pool;
const pool = new Pool({
    user: "api_user",
    host: "localhost",
    database: "sensors",
    password: "apiUser",
    port: 5432
});

module.exports = {
    query: function (text, ...args) { return pool.query(text, ...args) },
    pool
};