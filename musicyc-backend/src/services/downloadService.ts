import { runYtDlp } from "../utils/ytDlp.js";

export function downloadAudio(url: string) {
  return runYtDlp(["-x", "--audio-format", "mp3", "-o", "-", url]);
}
