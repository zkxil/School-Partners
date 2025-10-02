const mysql = require('mysql2/promise');
const MYSQL_CONFIG = require('../config/mysql_config.js');

const pool = mysql.createPool(MYSQL_CONFIG);

const query = async (sql, val) => {
  const [rows] = await pool.query(sql, val);
  return rows;
};

module.exports = { query };
