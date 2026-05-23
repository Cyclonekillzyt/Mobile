import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { showToast } from "@/utils/toast";
import { sendPasswordReset } from "@/lib/api/supabase";

export default function ResetPassword() {
  const theme = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      showToast.error("Missing email", "Enter your email");
      return;
    }

    try {
      setLoading(true);

      await sendPasswordReset(email);

      showToast.success("Email sent", "Check your inbox for reset link");

      router.replace("/(auth)/login");
    } catch (e: any) {
      showToast.error("Reset failed", e.message);
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
          marginBottom: 10,
        }}
      >
        Reset Password
      </Text>

      <Text
        style={{
          color: theme.subtext,
          marginBottom: 20,
        }}
      >
        Enter your email to receive a reset link
      </Text>

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
          marginBottom: 20,
          borderWidth: 1,
          borderColor: theme.border,
        }}
      />

      <TouchableOpacity onPress={handleReset} disabled={loading}>
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
            {loading ? "SENDING..." : "SEND RESET LINK"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
        <Text style={{ textAlign: "center", color: theme.primary }}>
          Back to Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
