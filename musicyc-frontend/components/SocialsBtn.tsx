import { TouchableOpacity } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { ComponentProps } from "react";
import { handleSocialsLogin } from "@/lib/api/supabase";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { showToast } from "@/utils/toast";

type IconName = ComponentProps<typeof Ionicons>["name"];

type Props = {
  provider: string;
  icon: IconName;
};

const SocialsBtn = ({ provider, icon }: Props) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={() => {
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          handleSocialsLogin(provider);
        } catch (e: any) {
          showToast.error("Login failed", e.message);
        }
      }}
      style={{
        borderWidth: 1,
        borderColor: theme.border,
        padding: 12,
        alignItems: "center",
        borderRadius: 9999,
      }}
    >
      <Ionicons name={icon} size={36} color={theme.text} />
    </TouchableOpacity>
  );
};

export default SocialsBtn;
