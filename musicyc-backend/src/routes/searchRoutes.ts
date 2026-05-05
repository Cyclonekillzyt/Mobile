import express from "express";
import { handleSearchRequest } from "../controllers/searchController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", requireAuth, handleSearchRequest);
export default router;
