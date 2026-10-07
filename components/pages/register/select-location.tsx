import type { KaKaoMapMouseEvent, KakaoMarker } from "@/types/kakao-map.types";
import Button from "@common/button";
import GrowBox from "@common/grow-box";
import Section from "@common/section";
import Text from "@common/text";
import useMapStore from "@store/useMapStore";
import useSheetHeightStore from "@store/useSheetHeightStore";
import { AlertTriangleIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Proposal } from "../mypage/link-list";
import locateVerify from "@/lib/api/marker/locate-verify";
import { FetchError } from "@lib/fetchData";

interface SelectLocationProps {
  next: ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => void;
  marker: KakaoMarker;
  position: { lat: number | null; lng: number | null };
  setPosition: (position: { lat: number | null; lng: number | null }) => void;
}

const SelectLocation = ({
  next,
  marker,
  position,
  setPosition,
}: SelectLocationProps) => {
  const { map } = useMapStore();
  const { sheetHeight, setCurHeight } = useSheetHeightStore();

  const [viewButton, setViewButton] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!map || !marker) return;

    const handleMapClick = (e: KaKaoMapMouseEvent) => {
      setErrorMessage("");
      const latlng = e.latLng;

      marker.setVisible(true);
      marker.setPosition(latlng);

      setViewButton(true);

      setPosition({ lat: latlng.getLat(), lng: latlng.getLng() });
      setCurHeight(sheetHeight.STEP_3.height);
    };

    window.kakao.maps.event.addListener(map, "click", handleMapClick);

    return () => {
      window.kakao.maps.event.removeListener(map, "click", handleMapClick);
    };
  }, [map, marker, setCurHeight, sheetHeight, setPosition]);

  const handleClick = () => {
    if (position.lat != null || position.lng != null) {
      setPosition({ lat: null, lng: null });
    }
    marker?.setVisible(false);
    setViewButton(false);
    setCurHeight(sheetHeight.STEP_1.height);
  };

  const handleNext = async () => {
    if (position.lat == null || position.lng == null) return;
    setLoading(true);
    try {
      await locateVerify(position.lat, position.lng);

      next({
        latitude: position.lat as number,
        longitude: position.lng as number,
      });
    } catch (e) {
      if (e instanceof FetchError) {
        const body = e.responseBody ?? "";
        if (body.includes("there is a marker already nearby")) {
          setErrorMessage("주변에 이미 철봉이 있습니다.");
        } else if (body.includes("marker is in restricted area")) {
          setErrorMessage("위치 등록이 제한된 구역입니다.");
        } else if (body.includes("operation is only allowed within South Korea")) {
          setErrorMessage("위치는 대한민국에만 등록 가능합니다.");
        } else if (body.includes("invalid latitude (Must be between 32 and 39)")) {
          setErrorMessage("위치 등록이 제한된 구역입니다.");
        } else {
          setErrorMessage("잠시 후 다시 시도해주세요.");
        }
      } else {
        setErrorMessage("잠시 후 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section className="flex h-full flex-col pb-4 pt-0">
      <div className="flex flex-col items-center web:mt-8">
          {position.lat != null && position.lng != null ? (
          <div className="h-32.5 w-32.5 translate-y-3 select-none">
            <Image
              src="/gopher.gif"
              alt="다음"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <Proposal size={130} />
        )}

        <div className="mt-8 w-full rounded-xl border border-location-badge-bg/80 bg-location-badge-bg/45 px-3.5 py-3 dark:border-location-badge-bg-dark/70 dark:bg-location-badge-bg-dark/35">
          <Text
            aria-live="polite"
            className="select-none text-center text-text-on-surface dark:text-grey-light"
            fontWeight="bold"
          >
            {position.lat != null && position.lng != null
              ? "위치를 확인한 뒤 다음으로 진행하세요."
              : "지도에서 등록할 위치를 선택하세요."}
          </Text>
        </div>

        <Button
          onClick={handleClick}
          className="mt-4 web:hidden"
          variant="contrast"
        >
          {position.lat != null && position.lng != null ? "다시 선택하기" : "위치 선택하기"}
        </Button>
        <div className="mt-3 flex w-full items-start rounded-lg border border-yellow/35 bg-yellow/10 px-2.5 py-2 dark:border-yellow-dark/45 dark:bg-yellow-dark/10">
          <div className="mr-2 mt-0.5">
            <AlertTriangleIcon size={14} className="text-yellow dark:text-yellow-dark" />
          </div>
          <Text typography="t7" className="text-text-on-surface-muted dark:text-grey">
            실제 철봉이 있는 위치만 등록해주세요. 부정확한 정보는 삭제될 수 있습니다.
          </Text>
        </div>
        {errorMessage !== "" && (
          <Text typography="t7" className="mt-4 text-red">
            {errorMessage}
          </Text>
        )}
      </div>

      <GrowBox />

      {viewButton && (
        <Button
          onClick={handleNext}
          disabled={position.lat == null || position.lng == null || loading}
          className="h-12"
        >
          다음
        </Button>
      )}
    </Section>
  );
};

export default SelectLocation;
