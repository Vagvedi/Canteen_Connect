const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('./data');

const JWT_SECRET = process.env.JWT_SECRET || 'replace-me-dev-secret';

const generateToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role, name: user.name }, JWT_SECRET, {
    expiresIn: '7d',
  });

const authMiddleware = (roles = []) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Missing token' });
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      const user = db.users.find((u) => u.id === payload.sub);
      if (!user) return res.status(401).json({ message: 'Invalid user' });
      if (allowed.length && !allowed.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = user;
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};

const register = (req, res) => {
  const { name, email, password, role = 'student' } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email, password required' });
  }
  if (!['student', 'staff'].includes(role)) {
    return res.status(400).json({ message: 'role must be student or staff' });
  }
  const exists = db.users.find((u) => u.email === email);
  if (exists) return res.status(409).json({ message: 'Email already registered' });
  const user = {
    id: `u${db.users.length + 1}`,
    name,
    email,
    role,
    password: bcrypt.hashSync(password, 8),
  };
  db.users.push(user);
  const token = generateToken(user);
  return res.status(201).json({ user: { ...user, password: undefined }, token });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password required' });
  }
  const user = db.users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = bcrypt.compareSync(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = generateToken(user);
  return res.json({ user: { ...user, password: undefined }, token });
};

module.exports = {
  authMiddleware,
  register,
  login,
  generateToken,
};

