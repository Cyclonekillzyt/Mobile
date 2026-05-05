import { create } from "zustand";
import { supabase } from "@/lib/api/supabase";

type User = {
  id: string;
  email?: string;
} | null;

type AuthStore = {
  user: User;
  loading: boolean;
  token: string;

  setUser: (user: User) => void;
  initAuth: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void; 
};
let hasInitialized = false;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  token: "",

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ loading }),

  initAuth: async () => {
    if (hasInitialized) return;
    hasInitialized = true;

    console.log("[AUTH] init starting");

    const { data } = await supabase.auth.getSession();

    set({
      user: data.session?.user ?? null,
      loading: false,
      token: data.session?.access_token,
    });

    supabase.auth.onAuthStateChange((event, session) => {
      console.log("[AUTH EVENT]", event);
      console.log("[AUTH SESSION]", "SESSION_INITIALIZED");

      set({ user: session?.user ?? null, token: session?.access_token ?? "" });
    });
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    set({ user: data?.user, token: data.session?.access_token ?? "" });
  },

  signOut: async () => {
    console.log("[AUTH] signing out");

    await supabase.auth.signOut();

    set({
      user: null,
      loading: false,
      token: "",
    });
  },
}));
