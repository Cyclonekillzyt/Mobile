import Queue from "bull";
import dotenv from "dotenv";
import { downloadAudio } from "../services/downloadService.js";
import { getCachedFilePath, isFileCached } from "../config/cacheDir.js";
import { incrementDownloadUsage } from "../services/usageService.js";
import { markSongCached } from "../services/songService.js";
dotenv.config();

console.log(process.env.PORT);

const redisUrl = new URL(process.env.REDIS_URL as string);

export const audioQueue = new Queue("audio-queue", {
  redis: {
    host: redisUrl.hostname,
    port: Number(redisUrl.port),
    password: redisUrl.password,
    tls: {},
  },
  limiter: {
    max: 5,
    duration: 1000,
  },
});
audioQueue.on("error", (err) => {
  console.error("Redis connection error:", err);
});

audioQueue.on("ready", () => {
  console.log("Connected to Redis");
});

audioQueue.process(async (job) => {
  const { videoId, type, userId } = job.data;
  const filePath = getCachedFilePath(videoId);

  if (isFileCached(videoId)) {
    console.log(`Cache hit for ${videoId}`);
    return { status: "Cached", videoId, path: filePath };
  }

  console.log(`Downloading ${type} for ${videoId}...`);

  await downloadAudio(`https://www.youtube.com/watch?v=${videoId}`, filePath);

  await markSongCached(videoId, filePath);
  
  if (userId) {
    await incrementDownloadUsage(userId);
  }

  return { status: "done", videoId };
});

audioQueue.on("completed", (job, results) => {
  console.log("Job completed:", job.id, results);
});
audioQueue.on("failed", (job, err) => {
  console.log("Job failed:", job?.id, err);
});

export const addAudioJob = async (
  videoId: string,
  type: string,
  userId: string,
) => {
  await audioQueue.add(
    {
      videoId,
      type,
      userId,
    },
    {
      jobId: videoId,
      attempts: 3,
      backoff: 5000,
    },
  );
};
