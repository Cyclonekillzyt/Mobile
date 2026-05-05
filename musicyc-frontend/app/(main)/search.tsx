import SearchInput from "@/components/SearchInput";
import { View, ScrollView } from "react-native";
import SearchResults from "@/components/SearchResults";

const search = () => {
  return (
    <View > 
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
