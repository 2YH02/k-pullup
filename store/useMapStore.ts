import type { Nullable } from "@/types";
import type { KakaoMap, KakaoMarker, KakaoOverlay } from "@/types/kakao-map.types";
import { create } from "zustand";

interface MapState {
  map: Nullable<KakaoMap>;
  mapEl: Nullable<HTMLDivElement>;
  markers: KakaoMarker[];
  overlays: KakaoOverlay[];
  selectedId: Nullable<number>;
  userLocationMarker: KakaoMarker | null;
  gpsWatchId: number | null;
  isTrackingLocation: boolean;
  setSelectedId: (selectedId: number | null) => void;
  setMap: (map: KakaoMap) => void;
  setMapEl: (mapEl: HTMLDivElement) => void;
  appendMarkers: (markers: KakaoMarker[]) => void;
  replaceMarkers: (markers: KakaoMarker[]) => void;
  appendOverlay: (overlay: KakaoOverlay) => void;
  replaceOverlays: (overlays: KakaoOverlay[]) => void;
  setUserLocationMarker: (marker: KakaoMarker | null) => void;
  setGpsWatchId: (watchId: number | null) => void;
  setIsTrackingLocation: (isTracking: boolean) => void;
  deleteAllMarker: () => void;
  deleteOverlays: () => void;
}

const useMapStore = create<MapState>()((set) => ({
  map: null,
  mapEl: null,
  markers: [],
  overlays: [],
  selectedId: null,
  userLocationMarker: null,
  gpsWatchId: null,
  isTrackingLocation: false,
  setSelectedId: (selectedId: number | null) => set({ selectedId }),
  setMap: (map: KakaoMap) => set({ map }),
  setMapEl: (mapEl: HTMLDivElement) => set({ mapEl }),
  appendMarkers: (markers: KakaoMarker[]) =>
    set((prev) => ({ markers: [...prev.markers, ...markers] })),
  replaceMarkers: (markers: KakaoMarker[]) => set({ markers }),
  appendOverlay: (overlay: KakaoOverlay) =>
    set((prev) => ({ overlays: [...prev.overlays, overlay] })),
  replaceOverlays: (overlays: KakaoOverlay[]) => set({ overlays }),
  setUserLocationMarker: (marker: KakaoMarker | null) =>
    set({ userLocationMarker: marker }),
  setGpsWatchId: (watchId: number | null) => set({ gpsWatchId: watchId }),
  setIsTrackingLocation: (isTracking: boolean) =>
    set({ isTrackingLocation: isTracking }),
  deleteAllMarker: () =>
    set((prev) => {
      prev.markers.forEach((marker) => {
        marker.setMap(null);
      });

      return { markers: [] };
    }),
  deleteOverlays: () =>
    set((prev) => {
      prev.overlays.forEach((overlay) => {
        overlay.setMap(null);
        // 클러스터 오버레이가 보유한 React root 를 unmount 하여 누수 방지 (P2-1)
        overlay.__reactRoot?.unmount();
      });

      return { overlays: [] };
    }),
}));

export default useMapStore;
