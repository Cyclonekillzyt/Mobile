import { useThemeStore } from "@/stores/themeStore";
import { lightTheme, darkTheme } from "@/lib/theme";
import { useColorScheme } from "react-native";
import { useEffect } from "react";

export function useTheme() {
  const scheme = useColorScheme();
  const setMode = useThemeStore((s) => s.setMode);
  const mode = useThemeStore((s) => s.mode);

  useEffect(() => {
    setMode(scheme ?? "light");
  }, [scheme, setMode]);

  return mode === "light" ? darkTheme : lightTheme;
}
