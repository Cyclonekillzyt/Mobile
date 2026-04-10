import { TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSearchStore } from "@/stores/searchStore";
import { useDebounce } from "@/hooks/useDebounce";
import { useSongSearch } from "@/hooks/useSongSearch";
import { useTheme } from "@/hooks/useTheme";

export default function SearchInput() {
  const [search, setSearch] = useState("");
  const theme = useTheme();

  const setQuery = useSearchStore((state) => state.setQuery);

  const debouncedSearch = useDebounce(search, 300);

  useSongSearch(debouncedSearch);

  return (
    <SafeAreaView
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
      edges={["top"]}
    >
      <TouchableOpacity className=" rounded-full">
        <Ionicons name="chevron-back-outline" size={35} color={theme.primary} />
      </TouchableOpacity>

      <TextInput
        placeholder="Search songs"
        placeholderTextColor={theme.subtext}
        className=" border rounded-2xl px-3 py-2  shadow-sm flex-1 "
        value={search}
        onChangeText={(text) => {
          setSearch(text);
          setQuery(text);
        }}
        style={{
          borderColor: theme.border,
          color: theme.text,
        }}
      />
      <TouchableOpacity className=" rounded-full">
        <Ionicons name="mic-outline" size={30} color={theme.primary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
