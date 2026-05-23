import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useRouter, usePathname } from "expo-router";
import * as Haptics from "expo-haptics";

const Navbar = () => {
  const pathname = usePathname();

  const tabs = [
    { name: "Home", icon: "home-outline", route: "/" },
    { name: "Library", icon: "albums-outline", route: "/playlist" },
    { name: "Player", icon: "play-circle-outline", route: "/player" },
    { name: "Search", icon: "search-outline", route: "/search" },
    { name: "Settings", icon: "settings-outline", route: "/settings" },
  ] as const;

  const theme = useTheme();
  const router = useRouter();

  const navigate = (route: (typeof tabs)[number]["route"]) =>
    router.push(route);

  return (
    <View
      style={{
        position: "absolute",
        bottom: 16, 
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8, 
        borderRadius: 16, 
        width: "95%",
        borderWidth: 1,
        backgroundColor: theme.card,
        borderColor: theme.border,
      }}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.route;

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

              navigate(tab.route);
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 4,
              flex: 1,
            }}
          >
            <Ionicons
              name={tab.icon as any}
              size={22}
              color={isActive ? theme.primary : theme.subtext}
            />

            <Text
              style={{
                color: isActive ? theme.primary : theme.subtext,
                fontSize: 11,
                marginTop: 4,
              }}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Navbar;
