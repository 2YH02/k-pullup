import type { KaKaoMapMouseEvent, KakaoMarker } from "@/types/kakao-map.types";
import BottomFixedButton from "@common/bottom-fixed-button";
import Button from "@common/button";
import GrowBox from "@common/grow-box";
import Section from "@common/section";
import Text from "@common/text";
import useMapStore from "@store/useMapStore";
import useSheetHeightStore from "@store/useSheetHeightStore";
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
  const { setSheetHeight } = useSheetHeightStore();

  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({ latitude: null, longitude: null });

  const handleClick = () => {
    if (location.latitude && location.longitude) {
      setLocation({ latitude: null, longitude: null });
    }
    setSheetHeight(20);
  };

  useEffect(() => {
    if (!map || !marker) return;

    const handleMapClick = (e: KaKaoMapMouseEvent) => {
      const latlng = e.latLng;

      marker.setVisible(true);
      marker.setPosition(latlng);

      setLocation({ latitude: latlng.getLat(), longitude: latlng.getLng() });
      setSheetHeight(80);
    };

    window.kakao.maps.event.addListener(map, "click", handleMapClick);

    return () => {
      window.kakao.maps.event.removeListener(map, "click", handleMapClick);
    };
  }, [map, marker]);

  return (
    <Section className="h-full pb-0 flex flex-col">
      <div className="flex flex-col  items-center mt-10">
        {location.latitude && location.longitude ? (
          <div className="w-[130px] h-[130px] translate-y-5 select-none">
            <Image
              src="/next.gif"
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
        <Button onClick={handleClick} className="mt-5" variant="contrast">
          {location.latitude && location.longitude
            ? "다시 선택하기"
            : "위치 선택하기"}
        </Button>
      </div>

      <GrowBox />

      <BottomFixedButton
        onClick={() => {
          next({
            latitude: location.latitude as number,
            longitude: location.longitude as number,
          });
        }}
        disabled={!location.latitude || !location.longitude}
        containerStyle="px-0"
      >
        다음
      </BottomFixedButton>
    </Section>
  );
};

export default SelectLocation;
