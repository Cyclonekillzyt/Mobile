import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CACHE_DIR = path.join(__dirname, "..", "cache", "audio");

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

export const temp = path.join(CACHE_DIR, ".temp");



if (!fs.existsSync(temp)) {
  fs.mkdirSync(temp, { recursive: true });
}


export const getCachedFile = (videoId: string) =>{
  const files = fs.readdirSync(CACHE_DIR);
  return files.find((f) => f.startsWith(videoId));
};

export const getCachedFilePath = (videoId: string) => {
  const file = getCachedFile(videoId);
  if (!file) return null;
  return path.join(CACHE_DIR, file);
};

export const isFileCached = (videoId: string) => !!getCachedFile(videoId);

