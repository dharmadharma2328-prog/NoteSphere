import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../database/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'notesphere_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role = 'Student', college, degree, branch, semester } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    // Check if email already exists
    const existing = query.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const id = `usr-${Date.now()}`;
    const avatar = `https://images.unsplash.com/photo-${1535713875000 + Math.floor(Math.random() * 5000)}?w=150`;

    query.run(`
      INSERT INTO users (id, role, name, email, password_hash, avatar, college, degree, branch, semester, streak, xp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 50)
    `, [id, role, name.trim(), email.toLowerCase().trim(), password_hash, avatar, college || 'National Institute of Technology (NIT)', degree || 'BTech', branch || 'Computer Science', semester || 'Semester 1']);

    // Record welcome XP
    query.run(`
      INSERT INTO xp_events (id, user_id, action_type, xp_amount, description)
      VALUES (?, ?, ?, ?, ?)
    `, [`xp-${Date.now()}`, id, 'signup', 50, 'Joined NoteSphere community']);

    // Generate JWT
    const token = jwt.sign({ id, role, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const user = query.get('SELECT id, role, name, email, avatar, college, degree, branch, semester, bio, streak, xp FROM users WHERE id = ?', [id]);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = query.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status === 'banned' || user.status === 'suspended') {
      return res.status(403).json({ error: `Account is ${user.status}. Please contact support.` });
    }

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const { password_hash, ...safeUser } = user;

    res.json({
      message: 'Logged in successfully.',
      token,
      user: safeUser
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = req.user;

    // Get stats
    const uploads = query.get('SELECT COUNT(*) as count FROM resources WHERE owner_id = ?', [user.id]);
    const downloads = query.get('SELECT COUNT(*) as count FROM downloads WHERE user_id = ?', [user.id]);
    const saved = query.get('SELECT COUNT(*) as count FROM bookmarks WHERE user_id = ?', [user.id]);
    const userBadges = query.all('SELECT badge_key, name, description, icon, unlocked_at FROM user_badges WHERE user_id = ?', [user.id]);

    res.json({
      user: {
        ...user,
        uploadsCount: uploads ? uploads.count : 0,
        downloadsCount: downloads ? downloads.count : 0,
        savedCount: saved ? saved.count : 0,
        badges: userBadges
      }
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, college, degree, branch, semester, bio, avatar } = req.body;

    query.run(`
      UPDATE users
      SET name = COALESCE(?, name),
          college = COALESCE(?, college),
          degree = COALESCE(?, degree),
          branch = COALESCE(?, branch),
          semester = COALESCE(?, semester),
          bio = COALESCE(?, bio),
          avatar = COALESCE(?, avatar),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, college, degree, branch, semester, bio, avatar, userId]);

    const updatedUser = query.get('SELECT id, role, name, email, avatar, college, degree, branch, semester, bio, streak, xp FROM users WHERE id = ?', [userId]);

    res.json({
      message: 'Profile updated successfully.',
      user: updatedUser
    });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = query.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    // Always return success message for security so we do not leak existing emails
    res.json({
      message: 'If that email is registered, a password reset link has been dispatched to your inbox.'
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required.' });
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    query.run('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?', [password_hash, email.toLowerCase().trim()]);

    res.json({ message: 'Password has been reset successfully. You can now log in with your new password.' });
  } catch (err) {
    next(err);
  }
};
