import type { Request, Response } from "express";
import { downloadAudio } from "../services/downloadService.js";

export async function handleDownloadRequest(req: Request, res: Response) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL required" });
  }

  try {
    res.setHeader("Content-Disposition", "attachment; filename=audio.mp3");
    res.setHeader("Content-Type", "audio/mpeg");

    const process = downloadAudio(url);

    process.stdout.pipe(res);

    process.stderr.on("data", (d) => console.error(d.toString()));
  } catch (err) {
    console.error(err);

    if (!res.headersSent) res.status(500).json({ message: "Internal error" });
  }
}
