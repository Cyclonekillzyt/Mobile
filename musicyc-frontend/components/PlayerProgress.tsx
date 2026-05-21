import { View, Text, StyleSheet, Pressable } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { usePlayerStore } from "@/stores/playerStore";
import { usePlayerControls } from "@/hooks/usePlayerControls";
import { useRef } from "react";



const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000)
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;

  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

const PlayerProgress = () => {
  const theme = useTheme();

  const progress = usePlayerStore((s) => s.progress);
  const duration = usePlayerStore((s) => s.duration);
  const { handleSeek } = usePlayerControls();
  const progressBarWidth = useRef(0);


  const percent = duration > 0? (progress / duration) * 100 : 0;

  return (
    <View style={styles.container}>
      <Pressable
          onLayout={(e) => {
            progressBarWidth.current = e.nativeEvent.layout.width
          }}
        onPress={(e) => {
          const x = e.nativeEvent.locationX;
          const percentage = x / progressBarWidth.current;
          const seekPosition = percentage * duration;

          handleSeek(seekPosition)
          }}
        style={[
          styles.track,
          {
            backgroundColor: theme.border,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${percent}%`,
              backgroundColor: theme.primary,
            },
          ]}
        />
      </Pressable>

      <View style={styles.timeRow}>
        <Text style={[styles.time, { color: theme.subtext }]}>
          {formatTime(progress)}
        </Text>

        <Text style={[styles.time, { color: theme.subtext }]}>
          {formatTime(duration)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,

    paddingHorizontal: 28,
  },

  track: {
    height: 6,

    borderRadius: 999,

    overflow: "hidden",
  },

  fill: {
    height: "100%",

    borderRadius: 999,
  },

  timeRow: {
    marginTop: 10,

    flexDirection: "row",
    justifyContent: "space-between",
  },

  time: {
    fontSize: 13,

    fontWeight: "600",
  },
});

export default PlayerProgress;
