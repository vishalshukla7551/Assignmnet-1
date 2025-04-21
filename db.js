const mysql = require("mysql2");
require("dotenv").config();
const { URL } = require("url");

const dbUrl = new URL(process.env.DATABASE_URL);

const pool = mysql.createPool({
  host: dbUrl.hostname,
  port: dbUrl.port,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace('/', ''),
});

module.exports = pool.promise();
