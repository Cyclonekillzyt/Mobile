import { spawn } from "child_process"

export function runYtDlp(args: string[]) {
  return spawn("yt-dlp", args)
}