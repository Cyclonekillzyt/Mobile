import type { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase.js";

export async function checkDownloadQuota(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("user_usage")
      .select("downloads")
      .eq("user_id", userId)
      .eq("date", today)
      .maybeSingle();

    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Database error" });
    }

    const downloadsToday = data?.downloads ?? 0;

    const DAILY_LIMIT = 20;

    if (downloadsToday >= DAILY_LIMIT) {
      return res.status(429).json({
        message: "Daily download limit reached",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
