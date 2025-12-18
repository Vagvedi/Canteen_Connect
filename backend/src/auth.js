const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const {
  getUserByEmail,
  getUserById,
  insertUser,
} = require('../db/mysql'); // ✅ FIXED PATH

const JWT_SECRET = process.env.JWT_SECRET || 'replace-me-dev-secret';

/* ======================
   TOKEN
====================== */
const generateToken = (user) =>
  jwt.sign(
    { sub: user.id, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

/* ======================
   AUTH MIDDLEWARE
====================== */
const authMiddleware = (roles = []) => {
  const allowed = Array.isArray(roles) ? roles : [roles];

  return async (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) return res.status(401).json({ message: 'Missing token' });

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      const user = await getUserById(payload.sub);
      if (!user) return res.status(401).json({ message: 'Invalid user' });

      const userObj = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        registerNumber: user.register_number,
      };

      if (allowed.length && !allowed.includes(userObj.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      req.user = userObj;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};

/* ======================
   REGISTER
====================== */
const register = async (req, res) => {
  let { name, email, password, role = 'student', registerNumber } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email, password required' });
  }

  // 🔥 VERY IMPORTANT
  role = role.toLowerCase();

  if (!['student', 'staff', 'admin'].includes(role)) {
    return res
      .status(400)
      .json({ message: 'role must be student, staff, or admin' });
  }

  if (role === 'student' && !registerNumber) {
    return res
      .status(400)
      .json({ message: 'Registration number is required for students' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const exists = await getUserByEmail(normalizedEmail);
    if (exists) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = {
      id: uuid(),
      name,
      email: normalizedEmail,
      role,
      password: bcrypt.hashSync(password, 10),
      registerNumber: role === 'student' ? registerNumber : null,
    };

    await insertUser(user);

    const token = generateToken(user);

    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        registerNumber: user.registerNumber,
      },
      token,
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Registration failed' });
  }
};

/* ======================
   LOGIN
====================== */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password required' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await getUserByEmail(normalizedEmail);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const userObj = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      registerNumber: user.register_number,
    };

    const token = generateToken(userObj);

    return res.json({ user: userObj, token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Login failed' });
  }
};

module.exports = {
  authMiddleware,
  register,
  login,
  generateToken,
};
