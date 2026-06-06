import { supabase } from "../lib/supabase.js";
import fs from "fs";

const BUCKET = "cache";

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

  console.log(`[CACHE UPLOAD] ${videoId}`);

  return storagePath;
}

export async function getCachedUrl(videoId: string) {
  const storagePath = `${videoId}.m4a`;

  const { error: existsError } = await supabase.storage
    .from(BUCKET)
    .download(storagePath);

  if (existsError) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60 * 60);

  if (error) {
    return null;
  }

  console.log(`[CACHE HIT] ${videoId}`);

  return data.signedUrl;
}
