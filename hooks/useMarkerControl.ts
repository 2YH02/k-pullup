import type { KakaoMap } from "@/types/kakao-map.types";
import useMapStore from "@store/useMapStore";
import { useRouter } from "next/navigation";

interface CreateMarkerOption {
  image?: "pending" | "active" | "selected";
  position?: any;
  markerId?: string | number;
}

interface CreateMarker {
  options: CreateMarkerOption;
  map: KakaoMap;
}

const useMarkerControl = () => {
  const router = useRouter();

  const { markers, setMarkers } = useMapStore();

  const createMarker = ({ options, map }: CreateMarker) => {
    const imageSize = new window.kakao.maps.Size(39, 39);
    const imageOption = { offset: new window.kakao.maps.Point(27, 45) };

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

  const deleteMarker = (markerId: number) => {
    if (!markers) return;
    const marker = markers.find((marker) => marker.Gb === String(markerId));

    marker?.setMap(null);
  };

  return { createMarker, deleteMarker };
};

export default useMarkerControl;
