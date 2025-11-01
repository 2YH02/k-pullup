import type { Nullable } from "@/types";
import type { KakaoMap, KakaoMarker } from "@/types/kakao-map.types";
import { create } from "zustand";

interface MapState {
  map: Nullable<KakaoMap>;
  mapEl: Nullable<HTMLDivElement>;
  markers: KakaoMarker[];
  overlays: any[];
  selectedId: Nullable<number>;
  userLocationMarker: any | null;
  gpsWatchId: number | null;
  isTrackingLocation: boolean;
  setSelectedId: (selectedId: number | null) => void;
  setMap: (map: KakaoMap) => void;
  setMapEl: (mapEl: HTMLDivElement) => void;
  setMarkers: (markers: KakaoMarker[]) => void;
  setOverlays: (overlay: any[]) => void;
  setUserLocationMarker: (marker: any | null) => void;
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
  setMarkers: (markers: KakaoMarker[]) =>
    set((prev) => ({ markers: [...prev.markers, ...markers] })),
  setOverlays: (overlay: any) =>
    set((prev) => ({ overlays: [...prev.overlays, overlay] })),
  setUserLocationMarker: (marker: any | null) => set({ userLocationMarker: marker }),
  setGpsWatchId: (watchId: number | null) => set({ gpsWatchId: watchId }),
  setIsTrackingLocation: (isTracking: boolean) => set({ isTrackingLocation: isTracking }),
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
