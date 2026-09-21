import express from 'express';
import { aiService } from '../services/ai/aiService.js';
import { optionalAuth } from '../../auth/middleware.js';

const router = express.Router();

router.post('/chat', optionalAuth, async (req, res, next) => {
  try {
    const { message, context, level, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required.' });
    const result = await aiService.explainConcept({ message, context, level, history });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/summarize', optionalAuth, async (req, res, next) => {
  try {
    const { text, topic } = req.body;
    if (!text && !topic) return res.status(400).json({ error: 'Text or topic is required for summarization.' });
    const result = await aiService.summarize({ text: text || topic, topic });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/generate-questions', optionalAuth, async (req, res, next) => {
  try {
    const { topic, count } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required.' });
    const result = await aiService.generateQuestions({ topic, count });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/generate-mcq', optionalAuth, async (req, res, next) => {
  try {
    const { topic, count, difficulty } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required.' });
    const result = await aiService.generateMcqs({ topic, count, difficulty });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/flashcards', optionalAuth, async (req, res, next) => {
  try {
    const { topic, count } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required.' });
    const result = await aiService.generateFlashcards({ topic, count });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/study-plan', optionalAuth, async (req, res, next) => {
  try {
    const { subject, daysRemaining, hoursPerDay } = req.body;
    if (!subject) return res.status(400).json({ error: 'Subject is required.' });
    const result = await aiService.generateStudyPlan({ subject, daysRemaining, hoursPerDay });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
