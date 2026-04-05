import express from 'express';
import { streamAudio } from '../controllers/streamController.js';

const router = express.Router();

router.get("/stream", streamAudio);
export default router;