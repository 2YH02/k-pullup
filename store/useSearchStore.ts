import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchData {
  addr?: string;
  place?: string;
  d?: number | null;
  lat?: string | null;
  lng?: string | null;
}

interface SearchState {
  searches: SearchData[];
  addSearch: (data: SearchData) => void;
  removeItem: (addr: string) => void;
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
      removeItem: (addr: string) =>
        set((state) => {
          const newSearches = state.searches.filter((search) => {
            return addr !== search.addr;
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
