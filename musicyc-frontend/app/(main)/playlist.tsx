import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { useEffect } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback } from "react";

import SearchInput from "@/components/SearchInput";
import { useSearchStore } from "@/stores/searchStore";
import { useDownloadStore } from "@/stores/downloadStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useTheme } from "@/hooks/useTheme";

const Playlist = () => {
  const theme = useTheme();

  const setOnline = useSearchStore((s) => s.setOnline);

  const songs = useDownloadStore((s) => s.songs);
  const refreshSongs = useDownloadStore((s) => s.refreshSongs);

  const setCurrentSong = usePlayerStore((s) => s.setCurrentSong);

  const router = useRouter();

  // run once
  useEffect(() => {
    setOnline(false);
  }, []);

  // IMPORTANT: refresh every time screen is opened
  useFocusEffect(
    useCallback(() => {
      refreshSongs();
    }, []),
  );

  const openSong = (song: any) => {
    setCurrentSong(song);
    router.push("/player");
  };

  return (
    <View style={{ flex: 1, padding: 12, backgroundColor: theme.background }}>
      <SearchInput />

      {songs.length === 0 ? (
        <View style={{ marginTop: 40, alignItems: "center" }}>
          <Text style={{ color: theme.subtext }}>No downloads yet</Text>
        </View>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.videoId}
          contentContainerStyle={{ paddingTop: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => openSong(item)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                padding: 10,
                marginBottom: 10,
                borderRadius: 12,
                backgroundColor: theme.card,
              }}
            >
              <Image
                source={{ uri: item.thumbnails.medium.url }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 8,
                }}
              />

              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: theme.text,
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  {item.title}
                </Text>

                <Text
                  numberOfLines={1}
                  style={{
                    color: theme.subtext,
                    fontSize: 13,
                    marginTop: 2,
                  }}
                >
                  {item.channel}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default Playlist;
