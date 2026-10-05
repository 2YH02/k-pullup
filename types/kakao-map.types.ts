export type Pos = {
  La: number;
  Ma: number;
};

export type LatLngFunctions = {
  getLat: () => number;
  getLng: () => number;
};

export type KakaoPoint = { x: number; y: number };

export interface KakaoMapProjection {
  containerPointFromCoords: (latlng: Pos & LatLngFunctions) => KakaoPoint;
  coordsFromContainerPoint: (point: KakaoPoint) => Pos & LatLngFunctions;
}

export interface KaKaoMapMouseEvent {
  latLng: Pos & LatLngFunctions;
  point: KakaoPoint;
}

export interface KakaoMap {
  getCenter: () => LatLngFunctions;
  setLevel: (level: number, options?: { anchor: Pos }) => void;
  setCenter: (pos: Pos) => void;
  panTo: (pos: Pos) => void;
  getLevel: () => number;
  relayout: VoidFunction;
  addOverlayMapTypeId: (mapTypeId: number) => void;
  removeOverlayMapTypeId: (mapTypeId: number) => void;
  getProjection: () => KakaoMapProjection;
  setDraggable: (draggable: boolean) => void;
}

export interface KakaoMarker {
  setPosition: (data: Pos & LatLngFunctions) => void;
  getPosition: () => Pos;
  setImage: (img: unknown) => void;
  setMap: (data: KakaoMap | null | number) => void;
  getTitle: () => string;
  setVisible: (visible: boolean) => void;
  setClickable: (clickable: boolean) => void;
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
