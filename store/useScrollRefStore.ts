import { create } from "zustand";

interface ScrollRefState {
  containerRef: React.RefObject<HTMLDivElement> | null;
  setContainerRef: (ref: React.RefObject<HTMLDivElement>) => void;
}

const useScrollRefStore = create<ScrollRefState>()((set) => ({
  containerRef: null,
  setContainerRef: (ref) => set({ containerRef: ref }),
}));

export default useScrollRefStore;
