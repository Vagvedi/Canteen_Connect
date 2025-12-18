const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const {
  waitForDB,
  ensureUsersTable,
  ensureMenuTable,
  ensureOrdersTable,
  ensureBillsTable,
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
   INIT DATABASE (SAFE)
======================= */
(async () => {
  try {
    await waitForDB();
    await ensureUsersTable();
    await ensureMenuTable();
    await ensureOrdersTable();
    await ensureBillsTable();
    console.log('✅ MySQL tables ready');
  } catch (err) {
    console.error(err.message);
  }
})();

/* =======================
   SERVER + SOCKET
======================= */
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

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
   SOCKET
======================= */
io.on('connection', (socket) => {
  const { role, userId } = socket.handshake.query;
  if (role === 'staff') socket.join('staff');
  if (userId) socket.join(userId);
});

/* =======================
   FRONTEND SERVING
======================= */
const frontendPath = path.join(__dirname, '../public');
app.use(express.static(frontendPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`🚀 App running on port ${PORT}`);
});
