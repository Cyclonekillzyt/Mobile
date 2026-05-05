import { runYtDlp } from "../utils/ytDlp.js";
import fs from "fs";
import path from "path";
import { getCachedFilePath, CACHE_DIR, temp } from "../config/cacheDir.js";
import { runFfmpeg } from "../utils/ffmpeg.js";

const activeStreams = new Map<string, Promise<void>>();

export async function createAudioStream(videoId: string) {
  const cachedPath = getCachedFilePath(videoId);

  if (cachedPath) {
    return fs.createReadStream(cachedPath);
  }

  if (activeStreams.has(videoId)) {
    await activeStreams.get(videoId);

    const cachedPath = getCachedFilePath(videoId);
    if (!cachedPath) throw new Error("File missing after processing");

    return fs.createReadStream(cachedPath);
  }

  const streamPromise = new Promise<void>((resolve, reject) => {
    const ytUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const process = runYtDlp([
      "-f",
      "ba[ext=m4a]/ba[acodec^=mp3]/ba/b",
      "--no-playlist",
      "-o",
      path.join(temp, "%(id)s.%(ext)s"),
      ytUrl,
    ]);

    process.stderr.on("data", (d) => console.error(d.toString()));

    process.on("close", (code) => {
      activeStreams.delete(videoId);
      code === 0
        ? resolve()
        : reject(new Error(`yt-dlp exited with code ${code}`));
    });
  });

  activeStreams.set(videoId, streamPromise);
  await streamPromise;
  const file = fs.readdirSync(temp).find((f) => f.startsWith(videoId));

  if (!file) throw new Error("Download failed: file not found");

  const tempPath = path.join(temp, file);
  const ext = path.extname(file);

  let finalPath: string;

  if (ext !== ".m4a") {
    const outputPath = path.join(temp, `${videoId}.m4a`);
    finalPath = path.join(CACHE_DIR, `${videoId}.m4a`);

    await new Promise<void>((resolve, reject) => {
      const process = runFfmpeg([
        "-y",
        "-i",
        tempPath,
        "-c:a",
        "aac",
        outputPath,
      ]);

      process.on("close", (code) => {
        if (code === 0) {
          fs.renameSync(outputPath, finalPath);
          fs.unlinkSync(tempPath);
          resolve();
        } else {
          reject(new Error(`conversion failed code:${code}`));
        }
      });
    });
  } else {
    finalPath = path.join(CACHE_DIR, `${videoId}.m4a`);
    fs.renameSync(tempPath, finalPath);
  }

  return fs.createReadStream(finalPath);
}
