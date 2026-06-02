import { View, Text } from "react-native";
import { useAuthStore } from "@/stores/authStore";

export default function Index() {
  const user = useAuthStore((s) => s.user);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home</Text>

      {user ? <Text>User ID: {user.id}</Text> : <Text>Not logged in</Text>}
    </View>
  );
}
