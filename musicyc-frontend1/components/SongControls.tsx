import { View, TouchableOpacity, StyleSheet } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { showToast } from "@/utils/toast";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { usePlayerControls } from "@/hooks/usePlayerControls";
import { usePlayerStore } from "@/stores/playerStore";
import { useDownload } from "@/hooks/useDownloadSong";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const SongControls = () => {
  const theme = useTheme();

  const { song, isPlaying, handleToggle } =
    usePlayerControls();
  
  
  

  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const setRepeatMode = usePlayerStore((s) => s.setRepeatMode);

  const isShuffled = usePlayerStore((s) => s.isShuffled);
  const setShuffle = usePlayerStore((s) => s.setShuffle);

  const disabled = !song;

  const scale = useSharedValue(1);

  const animatePress = () => {
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1);
    });
  };

  const playStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPlayPress = () => {
    if (disabled) return;

    animatePress();
    handleToggle();
  };

  const toggleRepeat = () => {
    if (repeatMode === "off") setRepeatMode("one");
    else if (repeatMode === "one") setRepeatMode("all");
    else setRepeatMode("off");
  };

  const toggleShuffle = () => {
    setShuffle(!isShuffled);
  };

  const { download } = useDownload();

  return (
    <View style={[styles.container, disabled && { opacity: 0.4 }]}>
      <TouchableOpacity
        onPress={toggleShuffle}
        disabled={disabled}
        style={styles.leserButtons}
      >
        <Ionicons
          name="shuffle"
          size={24}
          color={isShuffled ? theme.primary : theme.text}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disabled}
        style={styles.sideBtn}
      >
        <Ionicons name="play-skip-back" size={28} color={theme.text} />
      </TouchableOpacity>

      <AnimatedTouchable
        onPress={onPlayPress}
        disabled={disabled}
        style={[playStyle]}
      >
        <LinearGradient
          colors={[theme.gradient[0], theme.gradient[1]]}
          style={styles.playBtn}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={44}
            color="#fff"
            style={{
              marginLeft: isPlaying ? 0 : 4,
            }}
          />
        </LinearGradient>
      </AnimatedTouchable>

      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disabled}
        style={styles.sideBtn}
      >
        <Ionicons name="play-skip-forward" size={28} color={theme.text} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={toggleRepeat}
        disabled={disabled}
        style={styles.leserButtons}
      >
        <Ionicons
          name={
            repeatMode === "one"
              ? "repeat"
              : repeatMode === "all"
                ? "repeat"
                : "repeat-outline"
          }
          size={24}
          color={repeatMode !== "off" ? theme.primary : theme.text}
        />
      </TouchableOpacity>
      <TouchableOpacity
        disabled={disabled}
        style={styles.buttomButtons}
        onPress={() => (song && download(song)
          , showToast.info("downloading song"))}
      >
        <Ionicons name="download-outline" size={24} color={theme.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },

  sideBtn: {
    width: 58,
    height: 58,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  leserButtons: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  buttomButtons: {
    position: "absolute",
    right: 18,
    top: -10,
  },
  playBtn: {
    width: 96,
    height: 96,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SongControls;
