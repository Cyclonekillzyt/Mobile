import { runYtDlp } from "../utils/ytDlp.js";
import fs from "fs";
import { getCachedFilePath, isFileCached } from "../config/cacheDir.js";

const activeStreams = new Map<string, Promise<void>>();

export async function createAudioStream(videoId: string) {
  const cachedPath = getCachedFilePath(videoId);

  if (isFileCached(videoId)) {
    return fs.createReadStream(cachedPath);
  }
  if (activeStreams.has(videoId)) {
    return fs.createReadStream(cachedPath);
  }

  const streamPromise = new Promise<void>((resolve, reject) => {
    const ytUrl = `https://www.youtube.com/watch?v=${videoId}`;
     const process = runYtDlp([
       "-f",
       "251/bestaudio/best",
       "--no-playlist",
       "-o",
       cachedPath,
       ytUrl,
     ]);
    
    process.stderr.on("data", (d) => console.error(d.toString()));

    process.on("close", (code) => {
      activeStreams.delete(videoId);
      code === 0 ? resolve() : reject(new Error(`yt-dlp exited with code ${code}`));
    })
  });

  activeStreams.set(videoId, streamPromise);
  await streamPromise; 

  return fs.createReadStream(cachedPath);
}
