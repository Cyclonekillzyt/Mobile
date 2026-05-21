import { View, StyleSheet, ScrollView } from "react-native";

import { useTheme } from "@/hooks/useTheme";

import PlayerBackground from "@/components/PlayerBackground";
import PlayerHeader from "@/components/PlayerHeader";
import SongImage from "@/components/SongImage";
import PlayerMetadata from "@/components/PlayerMetadata";
import PlayerProgress from "@/components/PlayerProgress";
import SongControls from "@/components/SongControls";

const Player = () => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>


      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PlayerHeader />

        <View>
          <SongImage />
          <PlayerMetadata />

          <PlayerProgress />

          <SongControls />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingBottom: 60,
  },

  centerBlock: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingTop: 20,
  },
});

export default Player;
