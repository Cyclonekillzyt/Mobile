import { View, Text, TextInput , TouchableOpacity} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useRef, useState } from "react";
import { showToast } from "@/utils/toast";
import { supabase } from "@/lib/api/supabase";
import { useRouter, useLocalSearchParams } from "expo-router";



export default function VerifyPincode() {
  const theme = useTheme();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<Array<TextInput | null>>([]);

  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [loading, setLoading] = useState(false)

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

      if (error) throw error;

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
        Enter the 6-digit code sent to you
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
    </View>
  );
}
