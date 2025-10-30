// server/db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'xapp_user',
  password: process.env.DB_PASS || 'xapp_pass',
  database: process.env.DB_NAME || 'xapp_db',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
