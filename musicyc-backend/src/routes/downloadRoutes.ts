import express from 'express';
import { handleDownloadRequest } from '../controllers/downloadController.js';

const router = express.Router();

router.post("/download", handleDownloadRequest);
export default router;