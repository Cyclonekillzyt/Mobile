import { create } from "zustand";

type ThemeMode = "light" | "dark";

type ThemeStore = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: "dark",

  setMode: (mode: any) => set({ mode }),

  toggleTheme: () => set((state) => ({ mode: get().mode === "dark" ? "light" : "dark" }))
}));
