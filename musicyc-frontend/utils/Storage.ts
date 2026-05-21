import * as FileSystem from "expo-file-system/legacy";
import { Song } from "@/stores/searchStore";

export const APP_FOLDER = `${FileSystem.documentDirectory}Musicyc/`;

export async function setupStorage() {
  const info = await FileSystem.getInfoAsync(APP_FOLDER);

  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(APP_FOLDER, {
      intermediates: true,
    });
  }
}

export function getAudioPath(videoId: string) {
  return `${APP_FOLDER}${videoId}.mp3`;
}

export function getMetaPath(videoId: string) {
  return `${APP_FOLDER}${videoId}.json`;
}


export async function saveSong(
  videoId: string,
  metadata: Song,
  audioUrl: string,
) {
  const audioPath = getAudioPath(videoId);
  const metaPath = getMetaPath(videoId);

  await FileSystem.downloadAsync(audioUrl, audioPath);

  await FileSystem.writeAsStringAsync(metaPath, JSON.stringify(metadata));

  return {
    audioPath,
    metaPath,
  };
}




export async function getDownloadedSongs(): Promise<Song[]> {
  try {
    const files = await FileSystem.readDirectoryAsync(APP_FOLDER);

    const songs: Song[] = [];

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const metaPath = `${APP_FOLDER}${file}`;
      const content = await FileSystem.readAsStringAsync(metaPath);

      const song: Song = JSON.parse(content);

      songs.push(song);
    }

    return songs;
  } catch (error) {
    console.log("Load downloaded songs error:", error);
    return [];
  }
}


export async function getDownloadedAudio() {
  try {
    const files = await FileSystem.readDirectoryAsync(APP_FOLDER);

    return files;
  } catch (error) {
    console.log("Read folder error:", error);

    return [];
  }
}

export async function deleteAudio(filename: string) {
  try {
    const fileUri = `${APP_FOLDER}${filename}`;

    await FileSystem.deleteAsync(fileUri);

    console.log(`Deleted: ${filename}`);
  } catch (error) {
    console.log("Delete error:", error);
  }
}

