import { View, Image, Text } from "react-native"
import { useTheme } from "@/hooks/useTheme";


const Logo = () => {
  const theme = useTheme();
  return (
    <View
      style={{
        alignItems: "center",
        marginBottom: 30,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Image
        source={require("@/assets/images/logo.png")}
        style={{ width: 80, height: 80 }}
        resizeMode="contain"
      />

      <Text
        style={{
          color: theme.text,
          fontSize: 28,
          fontWeight: "900",
          marginTop: 10,
        }}
      >
        usicyc
      </Text>
    </View>
  );
}

export default Logo