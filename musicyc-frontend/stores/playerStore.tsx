import { create } from "zustand";
import type { Song } from "@/stores/searchStore";

type PlayerStore = {
  currentSong: Song | null;
  setCurrentSong: (song: Song) => void;
  clearSong: () => void;
};

export const usePlayerStore = create<PlayerStore>((set) => ({
  currentSong: null,

  setCurrentSong: (song) => set({ currentSong: song }),

  clearSong: () => set({ currentSong: null }),
}));
