import { runYtDlp } from "../utils/ytDlp.js";

export function createAudioStream(videoId: string) {
  const ytUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const process = runYtDlp([
    "-f",
    "bestaudio",
    "--no-playlist",
    "-o",
    "-",
    ytUrl,
  ]);

  return process;
}
