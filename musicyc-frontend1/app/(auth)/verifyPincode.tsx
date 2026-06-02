import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useRef, useState, useEffect } from "react";
import { showToast } from "@/utils/toast";
import { supabase } from "@/lib/api/supabase";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useVerificationStore } from "@/stores/useVerificationStore";

export default function VerifyPincode() {
  const theme = useTheme();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<Array<TextInput | null>>([]);

  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const clearPendingEmail = useVerificationStore(
    (state) => state.clearPendingEmail,
  );

  const handleVerify = async () => {
    const otp = code.join("");

    if (otp.length !== 6) {
      showToast.error("Invalid code", "Enter all 6 digits");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.verifyOtp({
        email: email as string,
        token: otp,
        type: "email",
      });

      console.log(data);
      if (error) throw error;
      clearPendingEmail();

      showToast.success("Verified", "Account activated");

      router.replace("/(main)");
    } catch (e: any) {
      showToast.error("Verification failed", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (text: string, index: number) => {
    if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    try {
      setResendCooldown(60);

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email as string,
      });

      if (error) throw error;

      showToast.success("Code sent", "Check your email");
    } catch (e: any) {
      showToast.error("Failed to resend", e.message);
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
          marginBottom: 10,
        }}
      >
        Verify Code
      </Text>

      <Text
        style={{
          color: theme.subtext,
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        Enter the 6-digit code sent to{"\n"}
        <Text style={{ color: theme.text }}>{email}</Text>
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputs.current[index] = ref;
            }}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace") {
                handleBackspace(digit, index);
              }
            }}
            autoCorrect={false}
            autoCapitalize="none"
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            passwordRules={undefined}
            secureTextEntry={false}
            maxLength={1}
            keyboardType="number-pad"
            style={{
              width: 50,
              height: 60,
              borderRadius: 12,
              textAlign: "center",
              fontSize: 20,
              color: theme.text,
              backgroundColor: theme.inputBg,
              borderWidth: 1,
              borderColor: theme.border,
            }}
          />
        ))}
      </View>

      <TouchableOpacity onPress={handleVerify} disabled={loading}>
        <Text
          style={{
            textAlign: "center",
            color: theme.primary,
            marginTop: 30,
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? "Verifying..." : "Verify Code"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          clearPendingEmail();

          router.replace("/(auth)/signup");
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: theme.subtext,
            marginTop: 16,
          }}
        >
          Wrong email? Change it
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: 60,
          left: 20,
        }}
      >
        <Text
          style={{
            color: theme.primary,
            fontSize: 16,
          }}
        >
          ← Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}
