import { supabase } from "../lib/supabase.js";

export async function markSongCached(videoId: string, filePath: string) {
  await supabase.from("songs").upsert({
    video_id: videoId,
    cached: true,
    filepath: filePath,
  });
}
