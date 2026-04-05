import express from 'express';
import { handleSearchRequest } from "../controllers/searchController.js";

const router = express.Router();

router.get("/search", handleSearchRequest);
export default router;