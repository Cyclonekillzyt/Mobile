import { View, Text, StyleSheet } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { usePlayerStore } from "@/stores/playerStore";

const PlayerMetadata = () => {
  const theme = useTheme();

  const song = usePlayerStore((s) => s.currentSong);

  if (!song) return null;

  return (
    <View style={styles.container}>
      <Text
        numberOfLines={1}
        style={[
          styles.title,
          {
            color: theme.text,
          },
        ]}
      >
        {song.title}
      </Text>

      <Text
        numberOfLines={1}
        style={[
          styles.artist,
          {
            color: theme.subtext,
          },
        ]}
      >
        {song.channel || "Unknown Artist"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 26,

    paddingHorizontal: 28,

    alignItems: "center",
  },

  title: {
    fontSize: 30,

    fontWeight: "800",

    letterSpacing: 0.3,

    textAlign: "center",
  },

  artist: {
    marginTop: 10,

    fontSize: 16,

    fontWeight: "500",

    opacity: 0.85,

    textAlign: "center",
  },
});

export default PlayerMetadata;
