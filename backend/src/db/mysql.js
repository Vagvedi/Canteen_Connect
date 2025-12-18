const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

/* =========================
   MYSQL CONNECTION (RAILWAY SAFE)
========================= */
const pool = mysql.createPool({
  uri: process.env.MYSQL_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false,
  },
});

/* =========================
   USERS
========================= */
const ensureUsersTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      role ENUM('student', 'staff', 'admin') NOT NULL DEFAULT 'student',
      password VARCHAR(255) NOT NULL,
      register_number VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const seedDefaultUsers = async () => {
  const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM users');
  if (count > 0) return;

  const users = [
    { id: 'u1', name: 'Alice', email: 'alice@uni.edu', role: 'student', password: 'password', registerNumber: 'REG-U1' },
    { id: 's1', name: 'Counter Staff', email: 'staff@uni.edu', role: 'staff', password: 'password' },
    { id: 'a1', name: 'Admin', email: 'admin@uni.edu', role: 'admin', password: 'password' },
  ];

  for (const u of users) {
    await pool.query(
      `INSERT INTO users (id, name, email, role, password, register_number)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        u.id,
        u.name,
        u.email,
        u.role,
        bcrypt.hashSync(u.password, 8),
        u.registerNumber || null,
      ]
    );
  }
};

/* =========================
   MENU
========================= */
const ensureMenuTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS menu (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(80) NOT NULL,
      price INT NOT NULL,
      available TINYINT(1) DEFAULT 1,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const seedDefaultMenu = async () => {
  const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM menu');
  if (count > 0) return;

  const items = [
    ['m1', 'Veg Burger', 'Meals', 80, 1, 'Veg patty'],
    ['m2', 'Masala Tea', 'Drinks', 15, 1, 'Masala chai'],
    ['m3', 'French Fries', 'Snacks', 50, 1, 'Crispy fries'],
  ];

  for (const i of items) {
    await pool.query(
      `INSERT INTO menu (id, name, category, price, available, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      i
    );
  }
};

/* =========================
   ORDERS
========================= */
const ensureOrdersTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64),
      customer_name VARCHAR(255),
      items JSON,
      total DECIMAL(10,2),
      status VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

/* =========================
   BILLS
========================= */
const ensureBillsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bills (
      id VARCHAR(64) PRIMARY KEY,
      bill_number VARCHAR(20),
      order_id VARCHAR(64),
      user_id VARCHAR(64),
      items JSON,
      total DECIMAL(10,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

module.exports = {
  pool,
  ensureUsersTable,
  ensureMenuTable,
  ensureOrdersTable,
  ensureBillsTable,
  seedDefaultUsers,
  seedDefaultMenu,
};
