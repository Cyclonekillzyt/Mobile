import { View, Image } from "react-native";
import { usePlayerStore } from "@/stores/playerStore";
import bg from "@/assets/images/bg.jpg";
import { useTheme } from "@/hooks/useTheme";

const SongImage = () => {
  const song = usePlayerStore((s) => s.currentSong);
  const theme = useTheme();

  return (
    <View
      style={{
        borderColor: theme.border,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        height: "60%",
        borderRadius: 16,
        alignSelf: "center",
      }}
    >
      <Image
        source={
          song
            ? {
                uri: song.thumbnails?.high?.url || song.thumbnails?.medium?.url,
              }
            : bg
        }
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 16,
        }}
        resizeMode="cover"
      />
    </View>
  );
};

export default SongImage;
