import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { updatePassword, supabase } from "@/lib/api/supabase";
import { showToast } from "@/utils/toast";

export default function UpdatePassword() {
  const theme = useTheme();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        showToast.error("Invalid session", "Please request a new reset link");
        router.replace("/(auth)/login");
      }
    };

    checkSession();
  }, []);

  const handleUpdate = async () => {
    if (!password || !confirm) {
      showToast.error("Missing fields", "Fill both inputs");
      return;
    }

    if (password.length < 6) {
      showToast.error("Weak password", "Minimum 6 characters");
      return;
    }

    if (password !== confirm) {
      showToast.error("Mismatch", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await updatePassword(password);

      showToast.success("Password updated", "You can now log in");

      router.replace("/(auth)/login");
    } catch (e: any) {
      showToast.error("Update failed", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: theme.auth,
      }}
    >
      <Text
        style={{
          color: theme.text,
          fontSize: 26,
          fontWeight: "800",
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        Set New Password
      </Text>

      <TextInput
        placeholder="New password"
        placeholderTextColor={theme.subtext}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
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

      <TextInput
        placeholder="Confirm password"
        placeholderTextColor={theme.subtext}
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        style={{
          backgroundColor: theme.inputBg,
          borderRadius: 12,
          padding: 14,
          color: theme.text,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: theme.border,
        }}
      />

      <TouchableOpacity onPress={handleUpdate} disabled={loading}>
        <LinearGradient
          colors={theme.gradient as [string, string]}
          style={{
            padding: 14,
            borderRadius: 12,
            alignItems: "center",
            opacity: loading ? 0.6 : 1,
          }}
        >
          <Text style={{ color: theme.text, fontWeight: "600" }}>
            {loading ? "UPDATING..." : "UPDATE PASSWORD"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
