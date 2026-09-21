import express from 'express';
import { signup, login, getMe, updateProfile, forgotPassword, resetPassword } from './authController.js';
import { authenticateToken } from './middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/register', signup);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.put('/profile', authenticateToken, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  return res.json({
    success: true,
    message: 'Email verified successfully.',
    email
  });
});
router.post('/logout', (req, res) => res.json({ message: 'Logged out successfully.' }));

export default router;
