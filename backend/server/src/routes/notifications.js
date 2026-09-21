import express from 'express';
import { getNotifications, markAsRead, markAllAsRead, clearNotifications } from '../controllers/notificationController.js';
import { authenticateToken } from '../../auth/middleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);
router.post('/read-all', markAllAsRead);
router.delete('/', clearNotifications);

export default router;
