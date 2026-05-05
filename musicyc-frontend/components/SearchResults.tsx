import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSearchStore } from "@/stores/searchStore";
import { useTheme } from "@/hooks/useTheme";
import { usePlayerStore } from "@/stores/playerStore";
import { useRouter } from "expo-router";

const SearchResults = () => {
  const theme = useTheme();
  const results = useSearchStore((state) => state.results);
  const loading = useSearchStore((state) => state.loading);
  const setCurrentSong = usePlayerStore((s) => s.setCurrentSong);
  const router = useRouter();

  if (!loading && results.length === 0) {
    return (
      <View
        style={{
          backgroundColor: theme.background,
          alignItems: "center",
          marginTop: 40,
        }}
      >
        <Text style={{ color: theme.subtext }}>No results found</Text>
      </View>
    );
  }
  return (
    <>
      {loading ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 40,
          }}
        >
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <View
          style={{
            paddingHorizontal: 12,
            paddingTop: 8,
          }}
        >
          {results.map((song) => (
            <TouchableOpacity
              key={song.videoId}
              style={{
                backgroundColor: theme.card,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                padding: 8,
                marginBottom: 12,
                borderRadius: 12,
              }}
              onPress={() => {
                setCurrentSong(song);
                router.push("/player");
              }}
            >
              <Image
                source={{ uri: song.thumbnails.medium.url }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 6,
                }}
              />

              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={{ color: theme.text, fontSize: 15, fontWeight: "600" }}
                  numberOfLines={1}
                >
                  {song.title}
                </Text>
                <Text
                  style={{
                    color: theme.subtext,
                    fontSize: 13,
                    marginTop: 2,
                  }}
                  numberOfLines={1}
                  
                >
                  {song.channel}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
};

export default SearchResults;
