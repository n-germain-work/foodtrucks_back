require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createPool({
  host: process.env.HOST,
  port: process.env.DB_PORT,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = connection;
