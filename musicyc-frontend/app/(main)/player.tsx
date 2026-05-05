import { View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import PlayerHeader from "@/components/PlayerHeader";
import SongImage from "@/components/SongImage";
import SongControls from "@/components/SongControls";

const Player = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <PlayerHeader />

      <SongImage />

      <SongControls />
    </View>
  );
};

export default Player;
