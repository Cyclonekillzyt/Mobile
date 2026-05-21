import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

type VerificationState = {
  pendingEmail: string | null;

  setPendingEmail: (email: string) => void;
  clearPendingEmail: () => void;
};


const storage = createJSONStorage(() => {
  if (Platform.OS === "web") {
    return {
      getItem: async (name: string) => {
        return localStorage.getItem(name);
      },

      setItem: async (name: string, value: string) => {
        localStorage.setItem(name, value);
      },

      removeItem: async (name: string) => {
        localStorage.removeItem(name);
      },
    };
  }

  return AsyncStorage;
});
export const useVerificationStore = create<VerificationState>()(
  persist(
    (set) => ({
      pendingEmail: null,

      setPendingEmail: (email) =>
        set({
          pendingEmail: email,
        }),

      clearPendingEmail: () =>
        set({
          pendingEmail: null,
        }),
    }),
    {
      name: "verification-storage",
      storage,
    },
  ),
);
