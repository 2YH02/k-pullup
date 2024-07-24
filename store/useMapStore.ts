import type { KakaoMap } from "@/types/kakao-map.types";
import { create } from "zustand";

interface MapState {
  map: KakaoMap | null;
  setMap: (map: KakaoMap) => void;
}

const useMapStore = create<MapState>()((set) => ({
  map: null,
  setMap: (map: KakaoMap) => set({ map }),
}));

export default useMapStore;
