import { TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSearchStore } from "@/stores/searchStore";
import { useDebounce } from "@/hooks/useDebounce";
import { useSongSearch } from "@/hooks/useSongSearch";
import { useTheme } from "@/hooks/useTheme";
import BackButton from "@/components/BackButton";

export default function SearchInput() {
  const [search, setSearch] = useState("");
  const theme = useTheme();

  const setQuery = useSearchStore((state) => state.setQuery);

  const debouncedSearch = useDebounce(search, 300);

  useSongSearch(debouncedSearch);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 10,
        backgroundColor: theme.card,
        borderColor: theme.border,
        borderWidth: 1,
        borderRadius: 12,
      }}
    >
      <BackButton />

      <TextInput
        placeholder="Search songs"
        placeholderTextColor={theme.subtext}
        value={search}
        onChangeText={(text) => {
          setSearch(text);
          setQuery(text);
        }}
        style={{
          borderWidth: 1,

          borderRadius: 16,
          paddingHorizontal: 12,
          paddingVertical: 8,
          flex: 1,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
          borderColor: theme.border,
          color: theme.text,
        }}
      />
      <TouchableOpacity
        style={{
          borderRadius: 9999,
        }}
      >
        <Ionicons name="mic-outline" size={30} color={theme.primary} />
      </TouchableOpacity>
    </View>
  );
}
