const mysql = require('mysql2/promise');

const DATABASE_URL = process.env.MYSQL_URL;

if (!DATABASE_URL) {
  throw new Error('❌ MYSQL_URL is not defined');
}

const pool = mysql.createPool({
  uri: DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Retry helper (VERY IMPORTANT FOR RAILWAY)
async function queryWithRetry(query, retries = 5) {
  while (retries > 0) {
    try {
      return await pool.query(query);
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        console.log('⏳ MySQL not ready yet, retrying...');
        await new Promise((res) => setTimeout(res, 5000));
        retries--;
      } else {
        throw err;
      }
    }
  }
  throw new Error('❌ MySQL connection failed after retries');
}

/* ===== TABLE SETUP ===== */

async function ensureUsersTable() {
  await queryWithRetry(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255),
      role VARCHAR(20)
    )
  `);
}

async function ensureMenuTable() {
  await queryWithRetry(`
    CREATE TABLE IF NOT EXISTS menu (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      price INT
    )
  `);
}

async function ensureOrdersTable() {
  await queryWithRetry(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      total INT,
      status VARCHAR(20)
    )
  `);
}

async function ensureBillsTable() {
  await queryWithRetry(`
    CREATE TABLE IF NOT EXISTS bills (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT,
      amount INT
    )
  `);
}

async function seedDefaultUsers() {
  await queryWithRetry(
    `INSERT IGNORE INTO users (id, name, email, password, role)
     VALUES (1, 'Admin', 'admin@canteen.com', 'admin', 'admin')`
  );
}

async function seedDefaultMenu() {
  await queryWithRetry(
    `INSERT IGNORE INTO menu (id, name, price)
     VALUES (1, 'Tea', 10)`
  );
}

module.exports = {
  ensureUsersTable,
  ensureMenuTable,
  ensureOrdersTable,
  ensureBillsTable,
  seedDefaultUsers,
  seedDefaultMenu,
};
