import express from 'express';
import { handleDownloadRequest } from '../controllers/downloadController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { checkDownloadQuota } from '../middleware/checkDownloadQuota.js';

const router = express.Router();

router.post("/download",requireAuth, checkDownloadQuota, handleDownloadRequest);
export default router;