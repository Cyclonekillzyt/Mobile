import { View, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { usePlayerStore } from "@/stores/playerStore";
import { useTheme } from "@/hooks/useTheme";

import bg from "@/assets/images/bg.png";

const SongImage = () => {
  const song = usePlayerStore((s) => s.currentSong);

  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={[theme.gradient[0], theme.gradient[1]]}
        start={{ x: 0, y: 0}}
        end={{ x: 1, y: 1 }}
        style={styles.glow}
      />

      <View
        style={[
          styles.imageContainer,
          {
            backgroundColor: theme.card,
          },
        ]}
      >
        <Image
          source={
            song
              ? {
                  uri:
                    song.thumbnails?.high?.url || song.thumbnails?.medium?.url,
                }
              : bg
          }
          resizeMode="cover"
          style={styles.image}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  glow: {
    position: "absolute",
    width: "84%",
    aspectRatio: 1,
    borderRadius: 40,
    opacity: 0.18,
    transform: [{ scale: 1.08 }],
  },

  imageContainer: {
    width: "84%",
    aspectRatio: 1,
    borderRadius: 36,
    overflow: "hidden",
    elevation: 25,
  },

  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent"
  },
});

export default SongImage;
