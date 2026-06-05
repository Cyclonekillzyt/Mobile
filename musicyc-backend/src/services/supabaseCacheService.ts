import { supabase } from "../lib/supabase.js";
import fs from "fs";

const BUCKET = "cache";

export async function isFileCached(videoId: string) {
  const { data, error } = await supabase
    .from("songs")
    .select("cached")
    .eq("video_id", videoId)
    .maybeSingle();

  if (error) {
    console.error("Cache lookup error:", error);
    return false;
  }

  return data?.cached ?? false;
}

export async function getCachedFile(videoId: string) {
  const { data, error } = await supabase
    .from("songs")
    .select("storage_path")
    .eq("video_id", videoId)
    .maybeSingle();

  if (error) {
    console.error("Cache lookup error:", error);
    return null;
  }

  return data;
}

export async function uploadToCache(videoId: string, filePath: string) {
  const storagePath = `${videoId}.m4a`;

  const fileBuffer = fs.readFileSync(filePath);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: "audio/m4a",
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return storagePath;
}

export async function getCachedUrl(videoId: string) {
  const { data: song, error: dbError } = await supabase
    .from("songs")
    .select("storage_path")
    .eq("video_id", videoId)
    .maybeSingle();

  if (dbError || !song) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(song.storage_path, 60 * 60);

  if (error) {
    console.error(error);
    return null;
  }

  return data.signedUrl;
}
