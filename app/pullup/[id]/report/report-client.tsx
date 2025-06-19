"use client";

import { type Device } from "@/app/mypage/page";
import BottomFixedButton from "@/components/common/bottom-fixed-button";
import MoveMap from "@/components/pages/pullup/move-map";
import type { Nullable } from "@/types";
import type { KaKaoMapMouseEvent, KakaoMarker } from "@/types/kakao-map.types";
import { Marker } from "@/types/marker.types";
import Button from "@common/button";
import GrowBox from "@common/grow-box";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import Textarea from "@common/textarea";
import WarningText from "@common/warning-text";
import { useToast } from "@hooks/useToast";
import reportMarker, { ReportValue } from "@lib/api/report/report-marker";
import ReportCompleted from "@pages/pullup/report/report-completed";
import UploadImage from "@pages/pullup/upload-image";
import useAlertStore from "@store/useAlertStore";
import useMapStore from "@store/useMapStore";
import { useEffect, useState } from "react";

interface ReportClientProps {
  marker: Marker;
  deviceType: Device;
}

const ReportClient = ({
  marker,
  deviceType = "desktop",
}: ReportClientProps) => {
  const { map, mapEl, markers } = useMapStore();
  const { openAlert } = useAlertStore();
  const { toast } = useToast();

  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [mapMarker, setMapMarker] = useState<Nullable<KakaoMarker>>(null);
  const [changeAddr, setChangeAddr] = useState<Nullable<string>>(null);

  const [reportValue, setReportValue] = useState<ReportValue>({
    markerId: marker.markerId,
    latitude: marker.latitude,
    longitude: marker.longitude,
    description: marker.description,
    photos: [],
  });

  const [newLatLng, setNewLatLng] =
    useState<Nullable<{ lat: number; lng: number }>>(null);

  useEffect(() => {
    if (!markers) return;

    markers.forEach((marker) => {
      marker.setClickable(false);
    });
  }, [markers]);

  useEffect(() => {
    if (!map) return;
    const imageSize = new window.kakao.maps.Size(40, 40);
    const imageOption = { offset: new window.kakao.maps.Point(21, 39) };
    const markerImage = new window.kakao.maps.MarkerImage(
      "/pending.png",
      imageSize,
      imageOption
    );

    const marker = new window.kakao.maps.Marker({
      image: markerImage,
      zIndex: 10,
    });

    marker.setMap(map);
    marker.setVisible(false);

    setMapMarker(marker);

    return () => {
      marker.setMap(null);
    };
  }, [map]);

  useEffect(() => {
    if (!newLatLng || !map) return;

    const mapContainer = document.getElementById("change-map");
    const mapOption = {
      center: new window.kakao.maps.LatLng(newLatLng.lat, newLatLng.lng),
      level: map.getLevel(),
    };

    const newMap = new window.kakao.maps.Map(mapContainer, mapOption);
    newMap.setDraggable(false);
    newMap.setZoomable(false);

    const imageSize = new window.kakao.maps.Size(32, 45);
    const imageOption = { offset: new window.kakao.maps.Point(16, 47) };

    const imageUrl = "/active-selected.png";

    const pin = new window.kakao.maps.MarkerImage(
      imageUrl,
      imageSize,
      imageOption
    );

    const position = new window.kakao.maps.LatLng(newLatLng.lat, newLatLng.lng);

    new window.kakao.maps.Marker({
      map: newMap,
      position: position,
      image: pin,
      clickable: false,
      zIndex: 5,
    });
  }, [map, newLatLng]);

  useEffect(() => {
    if (!mapMarker || !map) return;

    const geocoder = new window.kakao.maps.services.Geocoder();

    const handleMapClick = async (e: KaKaoMapMouseEvent) => {
      const latlng = e.latLng;

      mapMarker.setVisible(true);
      mapMarker.setPosition(latlng);

      geocoder.coord2Address(
        latlng.getLng(),
        latlng.getLat(),
        (result: any, status: any) => {
          let addr = "";
          if (status === window.kakao.maps.services.Status.OK) {
            addr = !!result[0].road_address
              ? result[0].road_address.address_name
              : "";
            addr += result[0].address.address_name;
          } else {
            addr = "위치 제공 안됨";
          }

          setChangeAddr(addr);
          setNewLatLng({ lat: latlng.getLat(), lng: latlng.getLng() });
          if (mapEl) mapEl.style.zIndex = "1";
        }
      );
    };

    window.kakao.maps.event.addListener(map, "click", handleMapClick);

    return () => {
      window.kakao.maps.event.removeListener(map, "click", handleMapClick);
    };
  }, [mapMarker, map]);

  const handleImageChange = (photos?: File[] | null) => {
    if (!photos) return;

    setReportValue((prev) => ({
      ...prev,
      photos: photos,
    }));
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReportValue((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  const setLoadingTrue = () => {
    setLoading(true);
  };
  const setLoadingFalse = () => {
    setLoading(false);
  };

  const changeLocation = () => {
    if (!mapEl) return;
    mapEl.style.zIndex = "20";
  };

  const onSubmit = async () => {
    setLoading(true);
    if (reportValue.photos.length <= 0) return;
    const sizeMap = reportValue.photos.map((photo) => {
      return photo.size / (1024 * 1024);
    });
    const totalSize = sizeMap.reduce((a, b) => a + b);

    if (totalSize > 28) {
      openAlert({
        title: "이미지 용량 초과",
        description: "최대 30MB까지 이미지를 등록할 수 있습니다.",
        onClick: () => {},
      });
      setLoading(false);
      return;
    }

    const data = newLatLng
      ? {
          ...reportValue,
          newLatitude: newLatLng.lat,
          newLongitude: newLatLng.lng,
        }
      : reportValue;

    const response = await reportMarker(data);

    if (!response.ok) {
      if (response.status === 400) {
        toast({
          description: "유효하지 않은 입력 정보입니다.",
        });
      } else if (response.status === 403) {
        toast({
          description: "한국 내부에서만 위치를 지정할 수 있습니다.",
        });
      } else if (response.status === 406) {
        toast({
          description: "새로운 위치가 기존 위치와 너무 멀리 떨어져 있습니다.",
        });
      } else if (response.status === 409) {
        toast({
          description: "이미지를 등록해주세요.",
        });
      } else {
        toast({
          description: "잠시 후 다시 시도해주세요",
        });
      }

      setLoading(false);
      return;
    }

    setLoading(false);
    setCompleted(true);
  };

  if (completed) {
    return <ReportCompleted />;
  }

  return (
    <SideMain
      headerTitle="정보 수정 요청"
      fullHeight
      hasBackButton
      deviceType={deviceType}
      bodyStyle="pb-0"
    >
      {/* 지도 이동 */}
      <MoveMap
        lat={marker.latitude}
        lng={marker.longitude}
        markerId={marker.markerId}
      />
      <Section className="pb-0 text-sm">
        <WarningText>
          요청된 정보가 부정확한 정보일 경우, 사전 안내 없이 삭제될 수 있습니다.
        </WarningText>
      </Section>
      <div className="flex flex-col h-full">
        {/* 설명 수정 */}
        <Section className=" pb-0">
          <Text className="mb-1" fontWeight="bold">
            수정할 설명을 입력해주세요.
          </Text>
          <Textarea
            placeholder="해당 위치에 대한 설명을 40자 이내로 작성해주세요."
            value={reportValue.description}
            onChange={handleDescChange}
          />
        </Section>

        {/* 이미지 등록 */}
        <div>
          <UploadImage
            next={handleImageChange}
            withButton={false}
            title={["새로운 이미지를 추가해주세요. (필수!)"]}
            setLoadingTrue={setLoadingTrue}
            setLoadingFalse={setLoadingFalse}
          />
        </div>

        <Section>
          <Text className="mb-1" fontWeight="bold">
            위치가 정확하지 않나요?
          </Text>
          <div>
            <Text typography="t6" fontWeight="bold">
              현재 위치:{" "}
            </Text>
            <Text typography="t6">{marker.address}</Text>
          </div>
          <div>
            {changeAddr && (
              <>
                <Text typography="t6" fontWeight="bold">
                  수정 위치:{" "}
                </Text>
                <Text typography="t6">{changeAddr}</Text>
              </>
            )}
          </div>
          <Button className="my-1 web:hidden" onClick={changeLocation}>
            위치 변경하기
          </Button>
          <WarningText className="text-sm mo:hidden">
            지도에서 위치를 수정할 위치를 클릭해 주세요!
          </WarningText>
          <div id="change-map" className="w-full h-52 web:hidden" />
        </Section>

        {/* 버튼 */}
        <GrowBox />

        <BottomFixedButton
          onClick={onSubmit}
          disabled={reportValue.photos.length <= 0 || loading}
          containerStyle="z-30"
        >
          수정 요청
        </BottomFixedButton>
      </div>
    </SideMain>
  );
};

export default ReportClient;
