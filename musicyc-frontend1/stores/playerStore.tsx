import { create } from "zustand";
import type { Song } from "@/stores/searchStore";

type RepeatMode = "off" | "one" | "all";

type PlayerStore = {
  progress: number;
  duration: number;
  isPlaying: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;

  setProgress: (v: number) => void;
  setDuration: (v: number) => void;
  setIsPlaying: (v: boolean) => void;
  currentSong: Song | null;
  setRepeatMode: (mode: RepeatMode) => void;
  setShuffle: (v: boolean) => void;
  setCurrentSong: (song: Song) => void;
  clearSong: () => void;
};

export const usePlayerStore = create<PlayerStore>((set) => ({
  progress: 0,
  duration: 0,
  isPlaying: false,
  currentSong: null,
  repeatMode: "off",
  isShuffled: false,

  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentSong: (song) => set({ currentSong: song }),
  setRepeatMode: (mode) => set({ repeatMode: mode }),
  setShuffle: (isShuffled) => set({ isShuffled }),
  clearSong: () => set({ currentSong: null }),
}));
