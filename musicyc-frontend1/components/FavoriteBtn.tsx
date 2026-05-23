import { TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/hooks/useTheme";

const FavoriteBtn = () => {
  const theme = useTheme();
  return (
    <TouchableOpacity  style={{borderRadius: 9999}}>
      <Ionicons name="heart-outline" size={35} color={theme.primary} />
    </TouchableOpacity>
  );
};

export default FavoriteBtn;
