import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import Navbar from "@/components/Navbar";
import Grain from "@/components/backgroudNoise";
import Toast from "react-native-toast-message";
import { useVerificationStore } from "@/stores/useVerificationStore";
import { supabase } from "@/lib/api/supabase";
import { setupStorage } from "@/utils/Storage";



export default function RootLayout() {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const initAuth = useAuthStore((s) => s.initAuth);
  const router = useRouter();

  useEffect(() => {
    initAuth();
    setupStorage();
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/(auth)/login");
    } else {
      router.replace("/(main)");
    }
  }, [user, loading]);

  const pendingEmail = useVerificationStore((state) => state.pendingEmail);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session && pendingEmail) {
        router.replace({
          pathname: "/(auth)/verifyPincode",
          params: {
            email: pendingEmail,
          },
        });
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator />
            <Toast />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      {user ? (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
          <Slot />
          <Toast />
          <Navbar />
        </SafeAreaView>
      ) : (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.auth }}>
          <Slot />
          <Toast />
        </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
}
