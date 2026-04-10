import { api } from "../api";

export async function searchSongs(query: string) {
  const response = await api.get("/search", {
    params: { query },
  });

  return response.data.results;
}
