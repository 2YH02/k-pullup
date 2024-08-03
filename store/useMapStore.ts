import type { KakaoMap, KakaoMarker } from "@/types/kakao-map.types";
import { create } from "zustand";

interface MapState {
  map: KakaoMap | null;
  markers: KakaoMarker[] | null;
  setMap: (map: KakaoMap) => void;
  setMarkers: (markers: KakaoMarker[]) => void;
}

const useMapStore = create<MapState>()((set) => ({
  map: null,
  markers: null,
  setMap: (map: KakaoMap) => set({ map }),
  setMarkers: (markers: KakaoMarker[]) => set({ markers }),
}));

export default useMapStore;
