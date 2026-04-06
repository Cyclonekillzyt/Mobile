import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CACHE_DIR = path.join(__dirname, "..", "cache", "audio");

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

export const getCachedFilePath = (videoId: string) =>
  path.join(CACHE_DIR, `${videoId}.webm`);

export const isFileCached = (videoId: string) =>
  fs.existsSync(getCachedFilePath(videoId));
