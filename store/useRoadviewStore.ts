import { create } from "zustand";

interface RoadviewState {
  open: boolean;
  lat: number | null;
  lng: number | null;
  openRoadview: ({ lat, lng }: { lat: number; lng: number }) => void;
  closeModal: () => void;
}

const useRoadviewStore = create<RoadviewState>()((set) => ({
  open: false,
  lat: null,
  lng: null,
  openRoadview: ({ lat, lng }: { lat: number; lng: number }) =>
    set({ lat, lng, open: true }),
  closeModal: () => set({ open: false, lat: null, lng: null }),
}));

export default useRoadviewStore;
