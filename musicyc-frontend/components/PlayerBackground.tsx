import { View, Image, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

import { usePlayerStore } from "@/stores/playerStore";

const PlayerBackground = () => {
  const song = usePlayerStore((s) => s.currentSong);

  const image = song?.thumbnails?.high?.url;

  if (!image) return null;

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Image
        source={{ uri: image }}
        resizeMode="cover"
        blurRadius={40}
        style={styles.image}
      />

      <View style={styles.overlay} />

      <BlurView
        intensity={70}
        tint="dark"
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",

    opacity: 0.45,

    transform: [{ scale: 1.15 }],
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: "rgba(0,0,0,0.45)",
  },
});

export default PlayerBackground;
