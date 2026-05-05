import { TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/hooks/useTheme";

import { useRouter } from "expo-router";

const BackButton = () => {
  const router = useRouter();
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={{ borderRadius: 9999 }}
      onPress={() => {
        router.canGoBack() ? router.back() : router.replace("/");
      }}
    >
      <Ionicons name="chevron-back-outline" size={35} color={theme.primary} />
    </TouchableOpacity>
  );
};

export default BackButton;
