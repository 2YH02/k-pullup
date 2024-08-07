"use client";

import LoadingIcon from "@/components/icons/loading-icon";
import useSheetHeightStore from "@/store/useSheetHeightStore";
import { KakaoMarker } from "@/types/kakao-map.types";
import setNewMarker, { SetMarkerRes } from "@api/marker/set-new-marker";
import SideMain from "@common/side-main";
import useIsMounted from "@hooks/useIsMounted";
import AuthError from "@layout/auth-error";
import FacilitiesComplete from "@pages/register/facilities-complete";
import SelectLocation from "@pages/register/select-location";
import SetDescription from "@pages/register/set-description";
import SetFacilities from "@pages/register/set-facilities";
import UploadComplete from "@pages/register/upload-complete";
import UploadImage from "@pages/register/upload-image";
import useAlertStore from "@store/useAlertStore";
import useMapStore from "@store/useMapStore";
import useMarkerStore from "@store/useMarkerStore";
import useUserStore from "@store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export type UploadStatus = "image" | "location" | "error" | "complete";

interface RegisterValue {
  latitude: number | null;
  longitude: number | null;
  photos: File[] | null;
  description: string | null;
  step: number;
}

const RegisterClient = () => {
  const router = useRouter();

  const isMounted = useIsMounted();
  const { user, setUser } = useUserStore();
  const { setSheetHeight } = useSheetHeightStore();

  const { setMarker: setMarkerToStore } = useMarkerStore();

  const { map } = useMapStore();
  const { openAlert } = useAlertStore();

  const [registerValue, setRegisterValue] = useState<RegisterValue>({
    photos: null,
    latitude: null,
    longitude: null,
    description: null,
    step: 0,
  });

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("location");

  const [errorMessage, setErrorMessage] = useState("");

  const [marker, setMarker] = useState<KakaoMarker | null>(null);

  const [newMarkerId, setNewMarkerId] = useState<number | null>(null);

  const headerTitle = useMemo(() => {
    if (registerValue.step === 0) return "위치 선택";
    if (registerValue.step === 1) return "이미지 등록";
    if (registerValue.step === 2) return "설명 등록";
    if (registerValue.step === 4) return "기구 개수 등록";
  }, [registerValue.step]);

  useEffect(() => {
    if (!map) return;
    const fetch = async () => {
      if (!registerValue.latitude || !registerValue.longitude) return;

      const response = await setNewMarker({
        description: registerValue.description || "",
        latitude: registerValue.latitude,
        longitude: registerValue.longitude,
        photos: registerValue.photos || [],
      });

      if (!response.ok) {
        if (response.status === 409) {
          setErrorMessage("주변에 이미 철봉이 있습니다.");
        } else if (response.status === 401) {
          setUser(null);
        }
        setUploadStatus("error");
        return;
      }

      const newMarker = (await response.json()) as SetMarkerRes;

      setNewMarkerId(newMarker.markerId);

      marker?.setMap(null);
      setMarkerToStore([newMarker]);

      map.setCenter(
        new window.kakao.maps.LatLng(newMarker.latitude, newMarker.longitude)
      );

      if (uploadStatus === "image") {
        setTimeout(() => {
          setUploadStatus("location");
          setTimeout(() => {
            setUploadStatus("complete");
          }, 1100);
        }, 1100);
      } else {
        setTimeout(() => {
          setUploadStatus("complete");
        }, 1100);
      }
    };
    if (registerValue.step === 3) {
      fetch();
    }
  }, [
    registerValue.step,
    registerValue.description,
    registerValue.latitude,
    registerValue.longitude,
    registerValue.photos,
    setUser,
  ]);

  useEffect(() => {
    if (!map) return;

    const imageSize = new window.kakao.maps.Size(44, 49);
    const imageOption = { offset: new window.kakao.maps.Point(21, 39) };
    const markerImage = new window.kakao.maps.MarkerImage(
      "/pin-pending.svg",
      imageSize,
      imageOption
    );

    const marker = new window.kakao.maps.Marker({
      image: markerImage,
    });

    marker.setMap(map);
    setMarker(marker);

    return () => {
      marker.setMap(null);
    };
  }, [map]);

  useEffect(() => {
    setSheetHeight(85);
  }, [setSheetHeight]);

  const handleLocationChange = ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    setRegisterValue((prev) => ({
      ...prev,
      latitude,
      longitude,
      step: prev.step + 1,
    }));
  };

  const handleImageChange = (photos?: File[] | null) => {
    if (photos && photos.length > 0) setUploadStatus("image");
    setRegisterValue((prev) => ({
      ...prev,
      photos: !photos ? null : photos,
      step: prev.step + 1,
    }));
  };

  const handleDescChange = (description?: string | null) => {
    setRegisterValue((prev) => ({
      ...prev,
      description: !description ? null : description,
      step: prev.step + 1,
    }));
  };

  const handleNext = () => {
    setRegisterValue((prev) => ({
      ...prev,
      step: prev.step + 1,
    }));
  };

  const handlePrev = () => {
    openAlert({
      title: registerValue.step === 4 ? "개수 등록 취소" : "위치 등록 취소",
      description:
        registerValue.step === 4
          ? "개수 등록을 취소 하시겠습니까?"
          : "위치 등록을 취소 하시겠습니까?",
      onClick: () => {
        router.back();
      },
      cancel: true,
    });
  };

  const resetStep = () => {
    setRegisterValue((prev) => ({
      ...prev,
      step: 0,
    }));
  };

  if (!isMounted || !user) {
    return (
      <SideMain headerTitle=" " prevClick={() => {}} hasBackButton>
        <div className="relative w-full h-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoadingIcon className="m-0" />
          </div>
        </div>
      </SideMain>
    );
  }

  if (user.error) {
    return (
      <AuthError
        headerTitle="위치 등록"
        errorTitle="로그인 후 철봉 위치를 등록해보세요."
        prevUrl="/"
        returnUrl="/register"
      />
    );
  }

  return (
    <SideMain
      headerTitle={headerTitle}
      prevClick={handlePrev}
      hasBackButton
      withNav={registerValue.step === 3 ? false : true}
      className={registerValue.step === 0 ? "duration-300" : ""}
      dragable={false}
    >
      {registerValue.step === 0 && (
        <SelectLocation
          next={handleLocationChange}
          marker={marker as KakaoMarker}
        />
      )}
      {registerValue.step === 1 && (
        <UploadImage
          next={handleImageChange}
          title={[
            "정확한 이미지를 등록해 주시면,",
            "다른 사람이 해당 위치를 찾는 데 큰 도움이 됩니다!",
          ]}
        />
      )}
      {registerValue.step === 2 && <SetDescription next={handleDescChange} />}
      {registerValue.step === 3 && (
        <UploadComplete
          status={uploadStatus}
          returnUrl={`/pullup/${newMarkerId}`}
          errorMessage={errorMessage}
          next={handleNext}
          resetStep={resetStep}
        />
      )}
      {registerValue.step === 4 && (
        <SetFacilities markerId={newMarkerId} next={handleNext} />
      )}
      {registerValue.step === 5 && (
        <FacilitiesComplete returnUrl={`/pullup/${newMarkerId}`} />
      )}
    </SideMain>
  );
};

export default RegisterClient;
