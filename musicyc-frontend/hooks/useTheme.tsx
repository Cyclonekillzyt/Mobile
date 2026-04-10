import { useThemeStore } from "@/stores/themeStore";
import { lightTheme, darkTheme } from "@/lib/theme";

export function useTheme() {
  const mode = useThemeStore((s) => s.mode)
  return mode === "dark" ? darkTheme : lightTheme;
}