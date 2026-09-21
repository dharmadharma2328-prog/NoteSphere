import jwt from 'jsonwebtoken';
import { query } from '../database/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'notesphere_super_secret_jwt_key_2026';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = query.get('SELECT id, role, name, email, avatar, college, degree, branch, semester, streak, xp, status FROM users WHERE id = ?', [decoded.id]);

    if (!user) {
      return res.status(401).json({ error: 'User account not found.' });
    }

    if (user.status === 'banned' || user.status === 'suspended') {
      return res.status(403).json({ error: `Account has been ${user.status}. Please contact administrator.` });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired authentication token.' });
  }
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = query.get('SELECT id, role, name, email, avatar, college, degree, branch, semester, streak, xp FROM users WHERE id = ?', [decoded.id]);
    req.user = user || null;
  } catch (err) {
    req.user = null;
  }
  next();
};
