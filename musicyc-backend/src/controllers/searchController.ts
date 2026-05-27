import type { Request, Response } from "express";
import { searchYouTube } from "../services/youtubeService.js";

export async function handleSearchRequest(req: Request, res: Response) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query parameter required" });
  }

  try {
    const results = await searchYouTube(query as string);

    res.json({ results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
