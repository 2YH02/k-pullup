import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchData {
  addr?: string;
  place?: string;
  markerId?: number | null;
  lat?: string | null;
  lng?: string | null;
}

interface SearchState {
  searches: SearchData[];
  addSearch: (data: SearchData) => void;
  removeItem: (addr: string) => void;
  clearSearches: VoidFunction;
}

// v0: markerId 를 `d` 필드에 저장하던 기존 포맷
type LegacySearchData = Omit<SearchData, "markerId"> & { d?: number | null };

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
      version: 1,
      migrate: (persistedState, version) => {
        const state = persistedState as { searches?: LegacySearchData[] };

        if (version === 0 && Array.isArray(state?.searches)) {
          return {
            ...state,
            searches: state.searches.map(({ d, ...rest }) => ({
              ...rest,
              markerId: d ?? null,
            })),
          } as SearchState;
        }

        return state as SearchState;
      },
    }
  )
);

export default useSearchStore;
