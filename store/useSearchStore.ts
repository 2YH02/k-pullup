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
          const MAX_SEARCHES = 50;
          // 같은 주소가 있으면 제거 후 맨 앞으로 올린다. (중복 방지 + 최신 우선)
          const deduped = state.searches.filter((search) => {
            return search.addr !== data.addr;
          });
          return { searches: [data, ...deduped].slice(0, MAX_SEARCHES) };
        }),
      removeItem: (addr: string) =>
        set((state) => {
          const newSearches = state.searches.filter((search) => {
            return addr !== search.addr;
          });

          return { searches: newSearches };
        }),
      clearSearches: () => set({ searches: [] }),
    }),
    {
      name: "search-history",
    }
  )
);

export default useSearchStore;
