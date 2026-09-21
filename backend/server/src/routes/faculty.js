import express from 'express';
import { getFacultyDashboard, verifyResource, createFacultyTest } from '../controllers/facultyController.js';
import { authenticateToken } from '../../auth/middleware.js';
import { authorize } from '../middleware/roles.js';

const router = express.Router();

router.use(authenticateToken);
router.use(authorize('Faculty', 'Admin'));

router.get('/dashboard', getFacultyDashboard);
router.patch('/resources/:id/verify', verifyResource);
router.post('/tests', createFacultyTest);

export default router;
