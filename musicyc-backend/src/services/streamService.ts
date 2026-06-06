import { runYtDlp } from "../utils/ytDlp.js";
import fs from "fs";
import path from "path";
import { getCachedFilePath, CACHE_DIR, temp } from "../config/cacheDir.js";
import { runFfmpeg } from "../utils/ffmpeg.js";
import { getCachedUrl } from "./supabaseCacheService.js";
import { uploadToCache } from "./supabaseCacheService.js";

const activeStreams = new Map<string, Promise<void>>();
type StreamResult =
  | { type: "local"; path: string }
  | { type: "remote"; url: string };

export async function createAudioStream(videoId: string) {
  const existing = getCachedFilePath(videoId);

  if (existing) {
    return { type: "local", path: existing };
  }
  const cachedUrl = await getCachedUrl(videoId);

  console.log("starting stream");

  if (cachedUrl) {
    return { type: "remote", url: cachedUrl };
  }

  if (activeStreams.has(videoId)) {
    await activeStreams.get(videoId);

    const cacheUrl = await getCachedUrl(videoId);
    if (!cacheUrl) throw new Error("File missing after processing");

    return { type: "remote", url: cachedUrl };
  }

  const streamPromise = new Promise<void>((resolve, reject) => {
    const ytUrl = `https://www.youtube.com/watch?v=${videoId}`;

    console.log("started");

    const process = runYtDlp([
      "-f",
      "ba[ext=m4a]/ba[acodec^=mp3]/ba/b",
      "--embed-metadata",
      "--embed-thumbnail",
      "--newline",
      "--no-playlist",
      "-o",
      path.join(temp, "%(id)s.%(ext)s"),
      ytUrl,
    ]);

    process.stderr.on("data", (d) => console.error(d.toString()));

    process.stderr.on("data", (d) => {
      const line = d.toString();

      console.log("[yt-dlp]", line);

      if (line.includes("%")) {
        console.log("PROGRESS:", line);
      }
    });

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

  uploadToCache(videoId, finalPath).catch(console.error);

  setTimeout(
    () => {
      fs.unlink(finalPath, (err) => {
        if (err) console.error("Cache delete failed:", err);
      });
    },
    10 * 60 * 1000,
  );
  return { type: "local", path: finalPath };
}
