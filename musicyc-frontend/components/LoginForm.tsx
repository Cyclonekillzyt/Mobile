import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { signIn } from "@/lib/api/supabase";
import { LinearGradient } from "expo-linear-gradient";
import PwdVisibility from "./PwdVisibility";
import { Checkbox } from "expo-checkbox";
import { useRouter } from "expo-router";
import { showToast } from "@/utils/toast";

const LoginForm = () => {
  const theme = useTheme();
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  const [isChecked, setChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  

  const handleLogin = async () => {
    if (!email || !password) {
      showToast.error("Missing fields", "Please fill all inputs");
      return;
    }

    try {
      setLoading(true);

      const data = await signIn(email, password);

      setUser(data.user);

      showToast.success("Welcome back", "Login successful");

      router.replace("/(main)");
    } catch (e: any) {
      showToast.error("Login failed", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TextInput
        placeholder="Email"
        placeholderTextColor={theme.subtext}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{
          backgroundColor: theme.inputBg,
          borderRadius: 12,
          padding: 14,
          color: theme.text,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: theme.border,
        }}
      />

      <View style={{ position: "relative", marginBottom: 16 }}>
        <TextInput
          placeholder="Password"
          placeholderTextColor={theme.subtext}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={{
            backgroundColor: theme.inputBg,
            borderRadius: 12,
            padding: 14,
            color: theme.text,
            borderWidth: 1,
            borderColor: theme.border,
          }}
        />

        <TouchableOpacity
          style={{
            position: "absolute",
            right: 15,
            top: "50%",
            transform: [{ translateY: -10 }],
          }}
        >
          <PwdVisibility
            visible={showPassword}
            onToggle={() => setShowPassword((prev) => !prev)}
          />
        </TouchableOpacity>
      </View>


      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          paddingHorizontal: 5,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <Checkbox
            style={{ width: 16, height: 16, borderColor: theme.border }}
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? "#4630EB" : undefined}
          />
          <Text style={{ color: theme.subtext, fontSize: 13 }}>
            Remember me
          </Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/(auth)/resetPassword")}>
          <Text style={{ color: theme.subtext, fontSize: 13 }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleLogin} disabled={loading}>
        <LinearGradient
          colors={theme.gradient as [string, string]}
          start={{ x: 0.3, y: 0.3 }}
          style={{
            padding: 14,
            borderRadius: 12,
            alignItems: "center",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color={theme.text} />
          ) : (
            <Text style={{ color: theme.text, fontWeight: "600" }}>
              SIGN IN
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <Text
        style={{
          textAlign: "center",
          color: theme.subtext,
          marginVertical: 16,
        }}
      >
        — OR —
      </Text>
    </>
  );
};

export default LoginForm;
