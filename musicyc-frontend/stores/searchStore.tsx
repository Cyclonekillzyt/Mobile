import { create } from "zustand";

type Song = {
  title: string;
  channel: string;
  videoId: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
};

type SearchStore = {
  query: string;
  results: Song[];
  loading: boolean
  setQuery: (query: string) => void;
  setResults: (results: Song[]) => void;
  setLoading: (loading: boolean) => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
  query: "",
  results: [],
  loading: false,

  setQuery: (query) => set({ query }),

  setResults: (results) => set({ results }),
  
  setLoading: (loading) => set({loading})
}));
