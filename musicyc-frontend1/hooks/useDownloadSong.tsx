import { useState } from "react";
import { DownloadSong } from "@/lib/api/downloadApi";
import { saveSong } from "@/utils/Storage";
import { Song } from "@/stores/searchStore";

export function useDownload() {
  const [loading, setLoading] = useState(false);

  const download = async (song: Song) => {
    try {
      setLoading(true);

    
      const res = await DownloadSong(song.videoId);

  
      const audioUrl = res.audioUrl;

     
      await saveSong(song.videoId, song, audioUrl);

      return true;
    } finally {
      setLoading(false);
    }
  };

  return { download, loading };
}
