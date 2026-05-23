import { api } from "../api";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "./supabase";

export async function searchSongs(query: string) {
  let token = useAuthStore.getState().token;

  try {
    const res = await api.get("/search", {
      params: { query },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.results;
  } catch (err: any) {
    if (err.response?.status === 401) {
      const { data } = await supabase.auth.getSession();
      token = data.session?.access_token ?? "";

      const retryRes = await api.get("/search", {
        params: { query },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return retryRes.data.results;
    }
    throw err;
  }
}
