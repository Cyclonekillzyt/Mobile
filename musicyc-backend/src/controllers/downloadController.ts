import type { Request, Response } from "express";
import fs from "fs";
import { addAudioJob } from "../workers/audioQueue.js";
import { getCachedFilePath, isFileCached } from "../config/cacheDir.js";

export async function handleDownloadRequest(req: Request, res: Response) {
  const { videoId, type = "download" } = req.body;

  if (!videoId) {
    return res.status(400).json({ message: "videoId required" });
  }

  try {
    const cachedPath = getCachedFilePath(videoId);

    console.log(cachedPath, "donwloadControllers");

    if (isFileCached(videoId)) {
      console.log(`Cache hit: ${videoId}`);
      res.setHeader("Content-Disposition", "attachment; filename=audio.mp3");
      res.setHeader("Content-Type", "audio/mpeg");
      if (cachedPath && fs.existsSync(cachedPath))
        fs.createReadStream(cachedPath).pipe(res);

      return;
    }

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    console.log(`Cache miss: ${videoId}, adding to queue...`);

    await addAudioJob(videoId, type, userId);

    res.status(202).json({
      message: "Download queued",
      videoId,
      type,
    });
  } catch (err) {
    console.error(err);

    if (!res.headersSent) res.status(500).json({ message: "Internal error" });
  }
}
