import SearchInput from "@/components/SearchInput";
import { View, ScrollView } from "react-native";
import "../global.css";
import SearchResults from "@/components/SearchResults";
import { useTheme } from "@/hooks/useTheme";

export default function Index() {
  const theme = useTheme();
  return (
    <View className="flex-1" style={{backgroundColor: theme.background}}>
      <SearchInput />

      <ScrollView>
        <View>
          <SearchResults />
        </View>
      </ScrollView>
    </View>
  );
}
