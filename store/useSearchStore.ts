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
  removeItem: (markerId: number) => void;
  clearSearches: VoidFunction;
}

const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      searches: [],
      addSearch: (data: SearchData) =>
        set((state) => {
          const item = state.searches.findIndex((search) => {
            return search.addr === data.addr;
          });

          if (item !== -1) {
            const newSearch = [...state.searches].filter((search) => {
              return search.addr !== data.addr;
            });
            return { searches: [data, ...newSearch] };
          }
          return { searches: [data, ...state.searches] };
        }),
      removeItem: (markerId: number) =>
        set((state) => {
          const newSearches = state.searches.filter((search) => {
            return markerId !== search.d;
          });

          if (newSearches) {
            return { searches: newSearches };
          }

          return { searches: state.searches };
        }),
      clearSearches: () => set({ searches: [] }),
    }),
    {
      name: "search-history",
    }
  )
);

export default useSearchStore;
