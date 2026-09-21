import express from 'express';
import { 
  getResources, getResourceById, createResource, getResourceFile,
  toggleLike, toggleBookmark, recordDownload, rateResource, reportResource
} from '../controllers/resourceController.js';
import { authenticateToken, optionalAuth } from '../../auth/middleware.js';
import { upload } from '../services/storage/storageService.js';

const router = express.Router();

router.get('/', optionalAuth, getResources);
router.post('/', authenticateToken, upload.single('file'), createResource);
router.get('/:id', optionalAuth, getResourceById);
router.get('/:id/file', getResourceFile);
router.post('/:id/like', authenticateToken, toggleLike);
router.post('/:id/bookmark', authenticateToken, toggleBookmark);
router.post('/:id/download', authenticateToken, recordDownload);
router.post('/:id/rate', authenticateToken, rateResource);
router.post('/:id/report', authenticateToken, reportResource);

export default router;
