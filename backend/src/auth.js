const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
  );

/* =======================
   AUTH MIDDLEWARE
======================= */
const authMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const token = authHeader.replace('Bearer ', '');

      const { data, error } = await supabase.auth.getUser(token);

      if (error || !data.user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (!profile) {
        return res.status(401).json({ message: 'User profile not found' });
      }

      if (requiredRole && profile.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      req.user = profile;
      next();
    } catch (err) {
      console.error('Auth error:', err);
      res.status(500).json({ message: 'Auth failed' });
    }
  };
};

/* =======================
   LOGIN (OPTIONAL)
======================= */
const login = async (_req, res) => {
  res.status(400).json({
    message: 'Login handled by Supabase on frontend',
  });
};

/* =======================
   REGISTER (OPTIONAL)
======================= */
const register = async (_req, res) => {
  res.status(400).json({
    message: 'Registration handled by Supabase on frontend',
  });
};

module.exports = {
  authMiddleware,
  login,
  register,
};
