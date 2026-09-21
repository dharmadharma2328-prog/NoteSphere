import express from 'express';
import { 
  getAdminStats, getUsers, updateUserRole, updateUserStatus, 
  getModerationResources, updateResourceModeration, getReports, resolveReport 
} from '../controllers/adminController.js';
import { authenticateToken } from '../../auth/middleware.js';
import { authorize } from '../middleware/roles.js';

const router = express.Router();

router.use(authenticateToken);
router.use(authorize('Admin'));

router.get('/dashboard', getAdminStats);
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', updateUserStatus);
router.get('/resources', getModerationResources);
router.patch('/resources/:id/moderation', updateResourceModeration);
router.get('/reports', getReports);
router.patch('/reports/:id/resolve', resolveReport);

export default router;
