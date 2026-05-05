import { spawn } from "child_process";

export function runFfmpeg(args: string[]) {
  return spawn("ffmpeg", args);
}