import { create } from "zustand";
interface imageCountState {
  count: number | null;
  setCount: (count: number) => void;
}
const useImageCountStore = create<imageCountState>()((set) => ({
  count: null,
  setCount: (count: number) => set({ count }),
}));

export default useImageCountStore;
