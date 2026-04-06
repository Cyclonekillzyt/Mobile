import { runYtDlp } from "../utils/ytDlp.js";

export function downloadAudio(url: string, outputPath: string) {
  return runYtDlp(["-x", "--audio-format", "mp3", "-o", outputPath, url]);
}
