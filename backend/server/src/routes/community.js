import express from 'express';
import { 
  getGroups, createGroup, toggleJoinGroup, 
  getDiscussions, createDiscussion, addReply, voteDiscussion, 
  getLeaderboard 
} from '../controllers/communityController.js';
import { authenticateToken, optionalAuth } from '../../auth/middleware.js';

const router = express.Router();

// Groups
router.get('/groups', optionalAuth, getGroups);
router.post('/groups', authenticateToken, createGroup);
router.post('/groups/:id/join', authenticateToken, toggleJoinGroup);

// Discussions Forum
router.get('/discussions', optionalAuth, getDiscussions);
router.post('/discussions', authenticateToken, createDiscussion);
router.post('/discussions/:id/reply', authenticateToken, addReply);
router.post('/discussions/:id/vote', authenticateToken, voteDiscussion);

// Leaderboard & Gamification
router.get('/leaderboard', optionalAuth, getLeaderboard);

export default router;
