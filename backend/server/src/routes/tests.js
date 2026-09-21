import express from 'express';
import { getTests, getTestById, submitTest, getAttemptById, getPracticeQuestions } from '../controllers/testController.js';
import { authenticateToken, optionalAuth } from '../../auth/middleware.js';

const router = express.Router();

router.get('/', optionalAuth, getTests);
router.get('/practice', optionalAuth, getPracticeQuestions);
router.get('/:id', optionalAuth, getTestById);
router.post('/:id/submit', authenticateToken, submitTest);
router.get('/attempts/:attemptId', optionalAuth, getAttemptById);

export default router;
