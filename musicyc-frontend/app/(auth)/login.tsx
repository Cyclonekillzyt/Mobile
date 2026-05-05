import { ComponentProps } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import SocialsBtn from "@/components/SocialsBtn";
import { Ionicons } from "@expo/vector-icons";
import LoginForm from "@/components/LoginForm";


export default function Login() {
  const theme = useTheme();

  const router = useRouter();

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
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: theme.auth,
      }}
    >
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

      <View
        style={{
          backgroundColor: theme.auth,
          borderRadius: 20,
          padding: 20,
        }}
      >
        <LoginForm />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 16,
            marginTop: 20,
          }}
        >
          {providers.map((item) => (
            <SocialsBtn
              key={item.provider}
              provider={item.provider}
              icon={item.icon}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={() => router.push("./signup")}
          style={{ marginTop: 20 }}
        >
          <Text
            style={{
              textAlign: "center",
              color: theme.subtext,
            }}
          >
            Don’t have an account?{" "}
            <Text style={{ color: theme.primary }}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
