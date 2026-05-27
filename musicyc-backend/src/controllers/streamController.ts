import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { createAudioStream } from "../services/streamService.js";
import { getCachedFilePath } from "../config/cacheDir.js";

export async function streamAudio(req: Request, res: Response) {
  const { videoId } = req.query as { videoId?: string };

  if (!videoId) {
    return res.status(400).json({ message: "videoId required" });
  }

  try {
    const stream = await createAudioStream(videoId);

    const cachedPath = getCachedFilePath(videoId);

    if (!cachedPath) {
      return res.status(404).json({ message: "Not cached yet" });
    }

    const stat = fs.statSync(cachedPath);
    const fileSize = stat.size;

    const range = req.headers.range;

    const ext = path.extname(cachedPath);
    const mime =
      ext === ".webm"
        ? "audio/webm"
        : ext === ".m4a"
          ? "audio/mp4"
          : "audio/ogg";

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0] ?? "0", 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const chunkStream = fs.createReadStream(cachedPath, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": mime,
      });

      chunkStream.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": mime,
      });

      stream.pipe(res);
    }
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.status(500).json({ message: "Internal error" });
  }
}
