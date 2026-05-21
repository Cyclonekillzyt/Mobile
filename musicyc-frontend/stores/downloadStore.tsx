import { create } from "zustand";
import type { Song } from "@/stores/searchStore";
import { getDownloadedSongs } from "@/utils/Storage";

type DownloadStore = {
  songs: Song[];
  setSongs: (songs: Song[]) => void;
  addSong: (song: Song) => void;
  refreshSongs: () => Promise<void>;
};

export const useDownloadStore = create<DownloadStore>((set) => ({
  songs: [],

  setSongs: (songs) => set({ songs }),

  addSong: (song) =>
    set((state) => ({
      songs: [song, ...state.songs],
    })),

  refreshSongs: async () => {
    const songs = await getDownloadedSongs();
    set({ songs });
  },
}));
