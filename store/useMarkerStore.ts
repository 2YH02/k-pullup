import type { MarkerRes } from "@api/marker/get-all-marker";
import { create } from "zustand";

interface MarkerState {
  marker: MarkerRes[];
  setMarker: (marker: MarkerRes[]) => void;
  replaceMarker: (marker: MarkerRes[]) => void;
  deleteMarker: (markerId: number) => void;
}

const useMarkerStore = create<MarkerState>()((set) => ({
  marker: [],
  setMarker: (marker: MarkerRes[]) =>
    set((prev) => ({ marker: [...prev.marker, ...marker] })),
  replaceMarker: (marker: MarkerRes[]) => set({ marker }),
  deleteMarker: (markerId: number) =>
    set((prev) => {
      const newMarker = prev.marker.filter(
        (item) => item.markerId !== markerId
      );

      return { marker: newMarker };
    }),
}));

export default useMarkerStore;
