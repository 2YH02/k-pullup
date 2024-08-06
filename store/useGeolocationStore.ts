import { create } from "zustand";

interface Location {
  lat: number;
  lng: number;
}

interface Region {
  address_name?: string;
  code?: string;
  region_1depth_name?: string;
  region_2depth_name?: string;
  region_3depth_name?: string;
  region_4depth_name?: string;
  region_type?: string;
}

interface GeolocationState {
  region: Region | null;
  myLocation: Location | null;
  curLocation: Location | null;
  geoLocationError: null | string;
  setRegion: (region: Region) => void;
  setMyLocation: (myLocation: Location) => void;
  setCurLocation: (curLocation: Location) => void;
  setGeoLocationError: (error: string | null) => void;
}

const useGeolocationStore = create<GeolocationState>()((set) => ({
  region: null,
  myLocation: null,
  curLocation: { lat: 37.566535, lng: 126.9779692 },
  geoLocationError: null,
  setMyLocation: (myLocation) => set({ myLocation }),
  setCurLocation: (curLocation) => set({ curLocation }),
  setRegion: (region: Region) => set({ region }),
  setGeoLocationError: (error) => set({ geoLocationError: error }),
}));

export default useGeolocationStore;
