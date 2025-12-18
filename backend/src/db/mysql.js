const mysql = require('mysql2/promise');

if (!process.env.MYSQL_URL) {
  throw new Error('❌ MYSQL_URL is not defined');
}

const pool = mysql.createPool({
  uri: process.env.MYSQL_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Wait until MySQL is ready (Railway-safe)
 */
async function waitForDB(retries = 15) {
  while (retries > 0) {
    try {
      await pool.query('SELECT 1');
      console.log('✅ MySQL connected');
      return;
    } catch (err) {
      retries--;
      console.log('⏳ Waiting for MySQL...');
      await new Promise(res => setTimeout(res, 4000));
    }
  }
  throw new Error('❌ MySQL not reachable after retries');
}

/**
 * TABLES
 */
async function ensureUsersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255),
      role VARCHAR(20) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function ensureMenuTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS menu (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      price INT,
      available BOOLEAN DEFAULT TRUE
    )
  `);
}

async function ensureOrdersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      item VARCHAR(100),
      quantity INT,
      status VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function ensureBillsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bills (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT,
      amount INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

module.exports = {
  pool,
  waitForDB,
  ensureUsersTable,
  ensureMenuTable,
  ensureOrdersTable,
  ensureBillsTable,
};
