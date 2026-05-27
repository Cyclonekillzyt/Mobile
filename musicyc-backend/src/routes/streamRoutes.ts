import express from 'express';
import { streamAudio } from '../controllers/streamController.js';
// import { requireAuth } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get("/stream", streamAudio);
export default router;