import { ComponentProps } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import SocialsBtn from "@/components/SocialsBtn";
import { Ionicons } from "@expo/vector-icons";
import LoginForm from "@/components/LoginForm";
import Logo from "@/components/Logo";


export default function Login() {
  const theme = useTheme();

  const router = useRouter();


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: theme.auth,
      }}
    >
      <Logo />
      <View
        style={{
          backgroundColor: theme.auth,
          borderRadius: 20,
          padding: 20,
        }}
      >
        <LoginForm />
        <Text
          style={{
            textAlign: "center",
            color: theme.subtext,
            marginVertical: 16,
          }}
        >
          — OR —
        </Text>
        <SocialsBtn/>

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
