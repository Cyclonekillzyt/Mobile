import { runYtDlp } from "../utils/ytDlp.js";

export function downloadAudio(url: string, outputPath: string) {
  return runYtDlp([
    "-f",
    "ba[ext=m4a]/ba[acodec^=mp3]/ba/b",
    "--embed-metadata",
    "--embed-thumbnail",
    "-o",
    outputPath,
    url,
  ]);
}
