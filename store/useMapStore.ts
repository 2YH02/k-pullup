import type { KakaoMap, KakaoMarker } from "@/types/kakao-map.types";
import { create } from "zustand";

interface MapState {
  map: KakaoMap | null;
  markers: KakaoMarker[];
  setMap: (map: KakaoMap) => void;
  setMarkers: (markers: KakaoMarker[]) => void;
  deleteAllMarker: () => void;
}

const useMapStore = create<MapState>()((set) => ({
  map: null,
  markers: [],
  setMap: (map: KakaoMap) => set({ map }),
  setMarkers: (markers: KakaoMarker[]) =>
    set((prev) => ({ markers: [...prev.markers, ...markers] })),
  deleteAllMarker: () =>
    set((prev) => {
      prev.markers.forEach((marker) => {
        marker.setMap(null);
      });

      return { ...prev };
    }),
}));

export default useMapStore;
