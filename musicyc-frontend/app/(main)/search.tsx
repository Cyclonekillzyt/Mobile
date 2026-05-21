import SearchInput from "@/components/SearchInput";
import { View, ScrollView } from "react-native";
import SearchResults from "@/components/SearchResults";
import { useSearchStore } from "@/stores/searchStore";

const search = () => {
  const setOnline = useSearchStore((state) => state.setOnline);

  setOnline(true);

  return (
    <View>
      <SearchInput />

      <ScrollView style={{ marginBottom: 130 }}>
        <View>
          <SearchResults />
        </View>
      </ScrollView>
    </View>
  );
};

export default search;
