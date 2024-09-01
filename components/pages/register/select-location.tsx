import type { KaKaoMapMouseEvent, KakaoMarker } from "@/types/kakao-map.types";
import BottomFixedButton from "@common/bottom-fixed-button";
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

interface SelectLocationProps {
  next: ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => void;
  marker: KakaoMarker;
}

const SelectLocation = ({ next, marker }: SelectLocationProps) => {
  const { map } = useMapStore();
  const { sheetHeight, setCurHeight } = useSheetHeightStore();

  const [viewButton, setViewButton] = useState(true);

  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({ latitude: null, longitude: null });

  useEffect(() => {
    if (!map || !marker) return;

    const handleMapClick = (e: KaKaoMapMouseEvent) => {
      const latlng = e.latLng;

      marker.setVisible(true);
      marker.setPosition(latlng);

      setViewButton(true);

      setLocation({ latitude: latlng.getLat(), longitude: latlng.getLng() });
      setCurHeight(sheetHeight.STEP_3.height);
    };

    window.kakao.maps.event.addListener(map, "click", handleMapClick);

    return () => {
      window.kakao.maps.event.removeListener(map, "click", handleMapClick);
    };
  }, [map, marker]);

  const handleClick = () => {
    if (location.latitude && location.longitude) {
      setLocation({ latitude: null, longitude: null });
    }
    setViewButton(false);
    setCurHeight(sheetHeight.STEP_1.height);
  };

  return (
    <Section className="h-full pb-0 flex flex-col">
      <div className="flex flex-col  items-center web:mt-10">
        {location.latitude && location.longitude ? (
          <div className="w-[130px] h-[130px] translate-y-5 select-none">
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

        <Text className="mt-10 select-none" fontWeight="bold">
          {location.latitude && location.longitude
            ? "다음을 클릭해주세요"
            : "먼저 지도를 클릭해 위치를 선택해주세요."}
        </Text>
        <Button
          onClick={handleClick}
          className="mt-5 web:hidden"
          variant="contrast"
        >
          {location.latitude && location.longitude
            ? "다시 선택하기"
            : "위치 선택하기"}
        </Button>
        <div className="w-full flex items-start mt-3">
          <div className="mr-2 mt-[2px]">
            <AlertTriangleIcon size={14} color="#ffc65c" />
          </div>
          <Text typography="t7" className="text-[#ffc65c]">
            등록된 위치에 철봉이 실제로 존재하지 않거나 부정확한 정보일 경우,
            사전 안내 없이 삭제될 수 있습니다.
          </Text>
        </div>
      </div>

      <GrowBox />

      {viewButton && (
        <BottomFixedButton
          onClick={() => {
            next({
              latitude: location.latitude as number,
              longitude: location.longitude as number,
            });
          }}
          disabled={!location.latitude || !location.longitude}
          className="flex items-center justify-center h-12 animate-transparent opacity-0"
          containerStyle="px-0"
        >
          다음
        </BottomFixedButton>
      )}
    </Section>
  );
};

export default SelectLocation;
