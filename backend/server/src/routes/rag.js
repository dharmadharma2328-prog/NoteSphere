import express from 'express';
import { ragService } from '../services/rag/ragService.js';
import { optionalAuth } from '../../auth/middleware.js';

const router = express.Router();

router.post('/:resourceId/index', optionalAuth, async (req, res, next) => {
  try {
    const { resourceId } = req.params;
    const result = await ragService.indexResource(resourceId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:resourceId/status', optionalAuth, async (req, res, next) => {
  try {
    const { resourceId } = req.params;
    const result = await ragService.getStatus(resourceId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/:resourceId/chat', optionalAuth, async (req, res, next) => {
  try {
    const { resourceId } = req.params;
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }
    const result = await ragService.chatWithDocument(resourceId, question);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
