export type Pos = {
  La: number;
  Ma: number;
};

export type LatLngFunctions = {
  getLat: () => number;
  getLng: () => number;
};

export interface KaKaoMapMouseEvent {
  latLng: Pos & LatLngFunctions;
  point: { x: number; y: number };
}

export interface KakaoMap {
  getCenter: () => LatLngFunctions;
  setLevel: (level: number, options?: { anchor: any }) => void;
  setCenter: (pos: Pos) => LatLngFunctions;
  panTo: (pos: Pos) => LatLngFunctions;
  getLevel: () => number;
  relayout: VoidFunction;
  addOverlayMapTypeId: (data: any) => void;
  removeOverlayMapTypeId: (data: any) => void;
  getProjection: () => any;
  setDraggable: (draggable: boolean) => void;
}

export interface KakaoMarker {
  setPosition: (data: Pos & LatLngFunctions) => void;
  getPosition: () => Pos;
  setImage: (img: any) => void;
  setMap: (data: KakaoMap | null | number) => void;
  getTitle: () => string;
  setVisible: (visible: boolean) => void;
  setClickable: (clickable: boolean) => void;
  Gb: string;
}

export interface KakaoOverlay {
  setMap: (map: KakaoMap | null) => void;
  /**
   * 클러스터 오버레이가 createRoot 로 렌더한 React root.
   * deleteOverlays 시 unmount 하여 React root 누수를 방지한다. (내부 전용)
   */
  __reactRoot?: { unmount: () => void };
}

export interface Qa {
  La: number;
  Ma: number;
}

export interface KakaoLatLng {
  center: Qa;
  level: number;
  maxLevel: number;
}
