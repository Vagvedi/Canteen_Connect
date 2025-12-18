const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const {
  ensureUsersTable,
  ensureMenuTable,
  ensureOrdersTable,
  ensureBillsTable,
  seedDefaultUsers,
  seedDefaultMenu,
} = require('./db/mysql');

const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');

const app = express();

/* =======================
   MIDDLEWARE
======================= */
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

/* =======================
   MYSQL INIT
======================= */
(async () => {
  try {
    await ensureUsersTable();
    await ensureMenuTable();
    await ensureOrdersTable();
    await ensureBillsTable();
    await seedDefaultUsers();
    await seedDefaultMenu();
    console.log('✅ MySQL tables initialized and seeded');
  } catch (err) {
    console.error('❌ Error initializing MySQL:', err);
  }
})();

/* =======================
   HTTP + SOCKET.IO
======================= */
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

// attach io to req
app.use((req, _res, next) => {
  req.io = io;
  next();
});

/* =======================
   API ROUTES
======================= */
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api', orderRoutes);

/* =======================
   SOCKET EVENTS
======================= */
io.on('connection', (socket) => {
  const { role, userId } = socket.handshake.query;

  if (role === 'staff') socket.join('staff');
  if (userId) socket.join(userId);
});

/* =======================
   FRONTEND (SINGLE SERVER)
======================= */
const publicPath = path.join(__dirname, '../public');

// Serve React build
app.use(express.static(publicPath));

// React Router fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

/* =======================
   SERVER START
======================= */
const PORT = process.env.PORT || 4000;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`🚀 App running on port ${PORT}`);
  });
}

module.exports = { app, server };
