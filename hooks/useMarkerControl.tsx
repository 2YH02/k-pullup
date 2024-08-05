import type { KakaoMap } from "@/types/kakao-map.types";
import Overlay from "@layout/overlay";
import { clusterMarkers } from "@lib/cluster-markers";
import { findNearbyMarkers } from "@lib/find-nearby-markers";
import useMapStore from "@store/useMapStore";
import useMarkerStore from "@store/useMarkerStore";
import { useRouter } from "next/navigation";
import { createRoot } from "react-dom/client";

interface CreateMarkerOption {
  image?: "pending" | "active" | "selected";
  position?: any;
  markerId?: string | number;
}

interface CreateOverlayOption {
  position?: any;
  title: string;
}

interface ReloadMarkersOprion {
  maxLevel: number;
}

interface CreateMarker {
  options: CreateMarkerOption;
  map: KakaoMap;
}

interface CreateOverlay {
  options: CreateOverlayOption;
  map: KakaoMap;
}

interface ReloadMarkers {
  options: ReloadMarkersOprion;
  map: KakaoMap;
}

const useMarkerControl = () => {
  const router = useRouter();

  const { setMarkers, setOverlays } = useMapStore();

  const { marker } = useMarkerStore();
  const { deleteAllMarker, deleteOverlays } = useMapStore();

  const createMarker = ({ options, map }: CreateMarker) => {
    const imageSize = new window.kakao.maps.Size(44, 49);
    const imageOption = { offset: new window.kakao.maps.Point(21, 39) };

    const imageUrl =
      options.image === "pending"
        ? "/pin-active.svg"
        : options.image === "selected"
        ? "/pin-selected.svg"
        : "/pin-active.svg";

    const pin = new window.kakao.maps.MarkerImage(
      imageUrl,
      imageSize,
      imageOption
    );

    const marker = new window.kakao.maps.Marker({
      map: map,
      position: options.position,
      title: options.markerId,
      image: pin,
      clickable: true,
    });

    setMarkers([marker]);

    window.kakao.maps.event.addListener(marker, "click", () => {
      router.push(`/pullup/${options.markerId}`);
    });
  };

  const createOverlay = ({ map, options }: CreateOverlay) => {
    const overlayDiv = document.createElement("div");
    const root = createRoot(overlayDiv);

    const overlay = new window.kakao.maps.CustomOverlay({
      position: options.position,
      content: overlayDiv,
      clickable: true,
    });

    root.render(<Overlay title={options.title} position={options.position} />);

    overlay.setMap(map);

    setOverlays(overlay);
  };

  const reloadMarkers = ({ map, options }: ReloadMarkers) => {
    deleteAllMarker();
    deleteOverlays();
    const position = map.getCenter();
    const level = map.getLevel();

    const distance = getDistance(level);

    const nearbyMarker = findNearbyMarkers({
      markers: marker,
      latitude: position.getLat(),
      longitude: position.getLng(),
      maxDistance: distance,
    });

    if (level >= options.maxLevel) {
      const group = clusterMarkers(nearbyMarker, getCellSize(level));
      for (let i = 0; i < group.length; i++) {
        createOverlay({
          map,
          options: {
            position: new window.kakao.maps.LatLng(
              group[i].centerLatitude,
              group[i].centerLongitude
            ),
            title: `${group[i].count} 개`,
          },
        });
      }
    } else {
      for (let i = 0; i < nearbyMarker.length; i++) {
        createMarker({
          map,
          options: {
            image: "active",
            markerId: nearbyMarker[i].markerId,
            position: new window.kakao.maps.LatLng(
              nearbyMarker[i].latitude,
              nearbyMarker[i].longitude
            ),
          },
        });
      }
    }
  };
  return { createMarker, createOverlay, reloadMarkers };
};

const getDistance = (level: number) => {
  switch (true) {
    case level <= 3:
      return 1;
    case level <= 5:
      return 2;
    case level <= 6:
      return 4;
    case level <= 7:
      return 7;
    case level <= 8:
      return 14;
    case level <= 9:
      return 21;
    case level <= 10:
      return 30;
    case level <= 11:
      return 40;
    default:
      return 120;
  }
};
const getCellSize = (level: number) => {
  switch (true) {
    case level === 6:
      return 0.02;
    case level === 7:
      return 0.04;
    case level === 8:
      return 0.08;
    case level === 9:
      return 0.2;
    case level === 10:
      return 0.5;
    case level === 11:
      return 0.8;
    default:
      return 1.6;
  }
};

export default useMarkerControl;
