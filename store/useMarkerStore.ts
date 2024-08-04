import type { MarkerRes } from "@api/marker/get-all-marker";
import { create } from "zustand";

interface MarkerState {
  marker: MarkerRes[];
  setMarker: (marker: MarkerRes[]) => void;
}

const useMarkerStore = create<MarkerState>()((set) => ({
  marker: [],
  setMarker: (marker: MarkerRes[]) => set({ marker }),
}));

export default useMarkerStore;
