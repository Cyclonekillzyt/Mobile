import { View, Text, TouchableOpacity, Button } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/stores/authStore";

const settings = () => {
  const theme = useTheme();
  const signOut = useAuthStore((s) => s.signOut);
  return (
    <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
      <Button title="Log out" onPress={signOut}></Button>
    </View>
  );
};

export default settings;
