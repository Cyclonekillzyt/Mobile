import * as WebBrowser from "expo-web-browser";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import "expo-sqlite/localStorage/install";
import { expo } from "@/app.json";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

WebBrowser.maybeCompleteAuthSession();
const redirectTo = `${expo.scheme}://auth`;

export const handleSocialsLogin = async (provider: any) => {
  console.log("REDIRECT URI:", redirectTo);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });
  if (error) throw error;

  const res = await WebBrowser.openAuthSessionAsync(
    data?.url ?? "",
    redirectTo,
  );

  if (res.type === "success") {
    const { url } = res;
    await createSessionFromUrl(url);
  }
};

export const getToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
};

export async function signIn(email: string, password: string) {
  console.log("[AUTH] email sign in");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("[AUTH ERROR]", error.message);
    throw error;
  }

  console.log("[AUTH] success");
  return data;
}

export async function signUp(
  userName: string,
  email: string,
  password: string,
) {
  console.log("[AUTH] sign up");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { userName: userName },
    },
  });

  if (error) {
    console.log("[SIGNUP ERROR]", error.message);
    throw error;
  }

  console.log("[AUTH] check email confirmation");
  return data;
}

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
};

export async function sendPasswordReset(email: string) {
  const redirectTo = `${expo.scheme}://reset-callback`;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    console.log("[RESET ERROR]", error.message);
    throw error;
  }

  console.log("[RESET] email sent");
  return data;
}

export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;

  return data;
}
