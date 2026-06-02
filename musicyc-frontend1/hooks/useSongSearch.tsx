import {  useEffect } from "react";
import { useSearchStore } from "@/stores/searchStore";
import { searchSongs } from "@/lib/api/searchApi";
 


export function useSongSearch(query: string) {
  const setResults = useSearchStore((s) => s.setResults);
  const setLoading = useSearchStore((s) => s.setLoading);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    };

    const fetchSongs = async () => {
      try {
        setLoading(true);
        const results = await searchSongs(query);

        setResults(results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [query]);
  return 
}
