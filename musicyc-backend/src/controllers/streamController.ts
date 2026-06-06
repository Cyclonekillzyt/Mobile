import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { createAudioStream } from "../services/streamService.js";

export async function streamAudio(req: Request, res: Response) {
  const { videoId } = req.query as { videoId?: string };

  if (!videoId) {
    return res.status(400).json({ message: "videoId required" });
  }

  try {
    const stream = await createAudioStream(videoId);

    if (stream.type === "remote") {
      if (!stream.url) {
        return res.status(500).json({ message: "Remote stream URL missing" });
      }
      return res.redirect(stream.url)
    }

    const cachedPath = stream.path;

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

      return chunkStream.pipe(res);
    }
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": mime,
    });

    return fs.createReadStream(cachedPath).pipe(res);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.status(500).json({ message: "Internal error" });
  }
}
