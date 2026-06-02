import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { signUp } from "@/lib/api/supabase";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { showToast } from "@/utils/toast";
import PwdVisibility from "@/components/PwdVisibility";
import { checkPasswordStrength } from "@/utils/passwordStrength";
import Logo from "@/components/Logo";
import SocialsBtn from "@/components/SocialsBtn";
import { useVerificationStore } from "@/stores/useVerificationStore";

export default function Signup() {
  const theme = useTheme();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const strength = checkPasswordStrength(password);
  const isStrongPassword = strength.label === "Strong";

  const setPendingEmail = useVerificationStore(
    (state) => state.setPendingEmail,
  );

  const handleSignup = async () => {
    if (!userName || !email || !password || !confirmPassword) {
      showToast.error("Missing fields", "Please fill all inputs");
      return;
    }

    if (!isStrongPassword) {
      showToast.error("Weak password", "Use a stronger password");
      return;
    }

    if (password !== confirmPassword && password !== "") {
      showToast.error("Passwords do not match, Please confirm password");
      return;
    }

    try {
      setLoading(true);

      await signUp(userName, email, password);

      setPendingEmail(email);

      showToast.success(
        "Account created",
        "Check your email for verification code",
      );

      Keyboard.dismiss();
      setTimeout(() => {
        router.replace({
          pathname: "/(auth)/verifyPincode",
          params: { email },
        });
      }, 300);
    } catch (e: any) {
      showToast.error("Signup failed", e.message);
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
          fontSize: 28,
          fontWeight: "900",
          marginBottom: 30,
          textAlign: "center",
        }}
      >
        Create Account
      </Text>

      <View
        style={{
          backgroundColor: theme.auth,
          borderRadius: 20,
          padding: 20,
        }}
      >
        <TextInput
          placeholder="Name"
          placeholderTextColor={theme.subtext}
          value={userName}
          onChangeText={setUserName}
          autoCapitalize="words"
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
            textContentType="newPassword"
            autoComplete="password-new"
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

        <View style={{ position: "relative", marginBottom: 16 }}>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor={theme.subtext}
            secureTextEntry={!showPassword}
            textContentType="newPassword"
            autoComplete="password-new"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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

        {password.length > 0 && (
          <Text
            style={{
              color:
                strength.label === "Weak"
                  ? "red"
                  : strength.label === "Medium"
                    ? "orange"
                    : theme.primary,
              fontSize: 12,
              marginBottom: 10,
            }}
          >
            Password strength: {strength.label}
          </Text>
        )}

        {confirmPassword.length > 0 && password !== confirmPassword && (
          <Text
            style={{
              color: "red",
              fontSize: 12,
              marginBottom: 10,
            }}
          >
            Passwords Do Not Match
          </Text>
        )}

        <TouchableOpacity
          onPress={handleSignup}
          disabled={loading || !isStrongPassword}
          style={{
            opacity: loading || !isStrongPassword ? 0.7 : 1,
          }}
        >
          <LinearGradient
            colors={theme.gradient as [string, string]}
            style={{
              padding: 14,
              borderRadius: 12,
              alignItems: "center",
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Text style={{ color: theme.text, fontWeight: "600" }}>
              {loading ? "CREATING..." : "SIGN UP"}
            </Text>
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
        <SocialsBtn />

        <TouchableOpacity
          onPress={() => router.replace("/(auth)/login")}
          style={{ marginTop: 20 }}
        >
          <Text style={{ textAlign: "center", color: theme.subtext }}>
            Already have an account?{" "}
            <Text style={{ color: theme.primary }}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
