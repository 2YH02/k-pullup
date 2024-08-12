import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchData {
  addr: string;
  d: number | null;
  lat?: string | null;
  lng?: string | null;
}

interface SearchState {
  searches: SearchData[];
  addSearch: (data: SearchData) => void;
  clearSearches: VoidFunction;
}

const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      searches: [],
      addSearch: (data: SearchData) =>
        set((state) => ({ searches: [data, ...state.searches] })),
      clearSearches: () => set({ searches: [] }),
    }),
    {
      name: "search-history",
    }
  )
);

export default useSearchStore;
