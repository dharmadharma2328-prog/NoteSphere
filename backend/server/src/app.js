import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from '../auth/auth.js';
import resourceRoutes from './routes/resources.js';
import aiRoutes from './routes/ai.js';
import ragRoutes from './routes/rag.js';
import testRoutes from './routes/tests.js';
import facultyRoutes from './routes/faculty.js';
import adminRoutes from './routes/admin.js';
import communityRoutes from './routes/community.js';
import notificationRoutes from './routes/notifications.js';
import { getMe, updateProfile } from '../auth/authController.js';
import {
  getResources,
  toggleBookmark,
  rateResource,
  toggleLike,
  reportResource,
  recordDownload,
  deleteUserRating
} from './controllers/resourceController.js';
import { authenticateToken, optionalAuth } from '../auth/middleware.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security and utility middleware
app.use(helmet({
  crossOriginResourcePolicy: false // Allow PDF and media embedding
}));
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve uploaded documents statically
const uploadsDir = path.resolve(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'NoteSphere 2.0 Academic Platform Engine',
    version: '2.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/rag', ragRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/notifications', notificationRoutes);

const versionedApi = express.Router();
const usersRouter = express.Router();
usersRouter.get('/me', authenticateToken, getMe);
usersRouter.patch('/me', authenticateToken, updateProfile);

versionedApi.use('/auth', authRoutes);
versionedApi.use('/users', usersRouter);
versionedApi.use('/resources', resourceRoutes);
versionedApi.use('/ai', aiRoutes);
versionedApi.use('/rag', ragRoutes);
versionedApi.use('/tests', testRoutes);
versionedApi.use('/faculty', facultyRoutes);
versionedApi.use('/admin', adminRoutes);
versionedApi.use('/community', communityRoutes);
versionedApi.use('/notifications', notificationRoutes);
versionedApi.post('/resources/:id/bookmark', authenticateToken, toggleBookmark);
versionedApi.delete('/resources/:id/bookmark', authenticateToken, toggleBookmark);
versionedApi.post('/resources/:id/rating', authenticateToken, rateResource);
versionedApi.delete('/resources/:id/rating', authenticateToken, deleteUserRating);
versionedApi.post('/resources/:id/download', authenticateToken, recordDownload);
versionedApi.post('/resources/:id/like', authenticateToken, toggleLike);
versionedApi.post('/resources/:id/report', authenticateToken, reportResource);
versionedApi.get('/search/resources', optionalAuth, (req, res, next) => {
  req.query.search = req.query.q || req.query.search || '';
  return getResources(req, res, next);
});
versionedApi.get('/docs', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'NoteSphere API',
      version: '2.0.0',
      description: 'Academic resource sharing platform API'
    },
    paths: {
      '/api/v1/auth/register': { post: { summary: 'Register a new user' } },
      '/api/v1/auth/login': { post: { summary: 'Log in to an existing account' } },
      '/api/v1/auth/logout': { post: { summary: 'Log out current user' } },
      '/api/v1/auth/me': { get: { summary: 'Get current user profile' } },
      '/api/v1/users/me': { get: { summary: 'Get current user profile' }, patch: { summary: 'Update current profile' } },
      '/api/v1/resources': { get: { summary: 'List resources' }, post: { summary: 'Create a resource' } },
      '/api/v1/resources/:id': { get: { summary: 'Get resource details' } },
      '/api/v1/search/resources': { get: { summary: 'Search resources with filters' } }
    }
  });
});
app.use('/api/v1', versionedApi);

app.get('/api/docs', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'NoteSphere API',
      version: '2.0.0',
      description: 'Academic resource sharing platform API'
    },
    paths: {
      '/api/v1/auth/register': { post: { summary: 'Register a new user' } },
      '/api/v1/auth/login': { post: { summary: 'Log in to an existing account' } },
      '/api/v1/auth/logout': { post: { summary: 'Log out current user' } },
      '/api/v1/auth/me': { get: { summary: 'Get current user profile' } },
      '/api/v1/resources': { get: { summary: 'List resources' }, post: { summary: 'Create a resource' } },
      '/api/v1/resources/:id': { get: { summary: 'Get resource details' } }
    }
  });
});

// Fallback 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

// Centralized error handler
app.use(errorHandler);

export default app;
