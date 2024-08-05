import type { KakaoMap, KakaoMarker } from "@/types/kakao-map.types";
import { create } from "zustand";

interface MapState {
  map: KakaoMap | null;
  markers: KakaoMarker[];
  overlays: any[];
  setMap: (map: KakaoMap) => void;
  setMarkers: (markers: KakaoMarker[]) => void;
  setOverlays: (overlay: any[]) => void;
  deleteAllMarker: () => void;
  deleteOverlays: () => void;
}

const useMapStore = create<MapState>()((set) => ({
  map: null,
  markers: [],
  overlays: [],
  setMap: (map: KakaoMap) => set({ map }),
  setMarkers: (markers: KakaoMarker[]) =>
    set((prev) => ({ markers: [...prev.markers, ...markers] })),
  setOverlays: (overlay: any) =>
    set((prev) => ({ overlays: [...prev.overlays, overlay] })),
  deleteAllMarker: () =>
    set((prev) => {
      prev.markers.forEach((marker) => {
        marker.setMap(null);
      });

      return { ...prev };
    }),
  deleteOverlays: () =>
    set((prev) => {
      prev.overlays.forEach((overlay) => {
        overlay.setMap(null);
      });

      return { ...prev };
    }),
}));

export default useMapStore;
