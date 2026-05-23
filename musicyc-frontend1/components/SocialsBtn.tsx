import { TouchableOpacity, View } from "react-native";
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

const SocialsBtn = () => {
  const providers: {
    provider: string;
    icon: ComponentProps<typeof Ionicons>["name"];
  }[] = [
    { provider: "google", icon: "logo-google" },
    { provider: "facebook", icon: "logo-facebook" },
    { provider: "github", icon: "logo-github" },
  ];
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        gap: 16,
        marginTop: 20,
      }}
    >
      {providers.map((item) => (
        <CreateButton
          key={item.provider}
          provider={item.provider}
          icon={item.icon}
        />
      ))}
    </View>
  );
};

export default SocialsBtn;

function CreateButton({ provider, icon }: Props) {
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
}

/* */
