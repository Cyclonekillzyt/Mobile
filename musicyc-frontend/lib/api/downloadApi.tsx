import { api } from "../api";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "./supabase";

export async function DownloadSong(videoId: string) {
  let token = useAuthStore.getState().token;

  try {
    const res = await api.post(
      "/download",
      { videoId }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      const { data } = await supabase.auth.getSession();

      token = data.session?.access_token ?? "";

      const retryRes = await api.post(
        "/download",
        { videoId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return retryRes.data;
    }

    throw err;
  }
}