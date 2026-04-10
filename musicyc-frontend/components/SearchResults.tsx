import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSearchStore } from "@/stores/searchStore";
import { useTheme } from "@/hooks/useTheme";

const SearchResults = () => {
  const theme = useTheme();
  const results = useSearchStore((state) => state.results);
  const loading = useSearchStore((state) => state.loading);
  if (!loading && results.length === 0) {
    return (
      <View className="items-center mt-10" style={{ backgroundColor: theme.background }}>
        <Text style={{ color: theme.subtext }}>No results found</Text>
      </View>
    );
  }
  return (
    <>
      {loading ? (
        <View className="flex-1 items-center justify-center mt-10">
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <View className="px-3 pt-2">
          {results.map((song) => (
            <TouchableOpacity
              key={song.videoId}
              className="flex-row items-center gap-3 p-2 mb-3 rounded-xl"
              style={{ backgroundColor: theme.card }}
            >
              <Image
                source={{ uri: song.thumbnails.medium.url }}
                className="w-14 h-14 rounded-md"
              />

              <View className="flex-1">
                <Text
                  style={{ color: theme.text }}
                  numberOfLines={1}
                  className="text-[15px] font-semibold"
                >
                  {song.title}
                </Text>
                <Text
                  style={{ color: theme.subtext }}
                  numberOfLines={1}
                  className="text-[13px] text-gray-500 mt-0.5"
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
