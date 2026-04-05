import type { Request, Response } from "express";
import { createAudioStream } from "../services/streamService.js";

export function streamAudio(req: Request, res: Response) {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ message: "videoId required" });
  }

  res.setHeader("Content-Type", "audio/mpeg");

  const streamProcess = createAudioStream(videoId as string);

  streamProcess.stdout.pipe(res);

  streamProcess.stderr.on("data", (data) => {
    console.error("yt-dlp error:", data.toString());
  });

  streamProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(`yt-dlp exited with code ${code}`);
    }
  });
}
