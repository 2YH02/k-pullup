"use client";

import { KakaoMarker } from "@/types/kakao-map.types";
import setNewFacilities from "@api/marker/set-new-facilities";
import setNewMarker, { SetMarkerRes } from "@api/marker/set-new-marker";
import Skeleton from "@common/skeleton";
import SideMain from "@common/side-main";
import useIsMounted from "@hooks/useIsMounted";
import AuthError from "@layout/auth-error";
import SelectLocation from "@pages/register/select-location";
import SetDescription from "@pages/register/set-description";
import SetFacilities from "@pages/register/set-facilities";
import UploadComplete from "@pages/register/upload-complete";
import UploadImage, {
  type ImageUploadState,
} from "@pages/register/upload-image";
import useAlertStore from "@store/useAlertStore";
import useMapStore from "@store/useMapStore";
import useMarkerStore from "@store/useMarkerStore";
import useUserStore from "@store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { type Device } from "../mypage/page";

export const registerError = {
  400: "설명에 비속어가 포함되어 있습니다.",
  401: "로그인 후 이용 가능합니다.",
  403: "위치는 대한민국에만 등록 가능합니다.",
  409: "주변에 이미 철봉이 있습니다.",
  422: "위치 등록이 제한된 구역입니다.",
};

export type UploadStatus =
  | "image"
  | "location"
  | "error"
  | "complete"
  | "facilities";

interface RegisterValue {
  latitude: number | null;
  longitude: number | null;
  photos: File[] | null;
  description: string | null;
  step: number;
  facilities: { facilityId: number; quantity: number }[];
}

const wait = (sec: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000);
  });
};

const RegisterClient = ({
  referrer = true,
  deviceType = "desktop",
}: {
  referrer?: boolean;
  deviceType?: Device;
}) => {
  const router = useRouter();

  const isMounted = useIsMounted();

  const { user, setUser } = useUserStore();

  const { setMarker: setMarkerToStore } = useMarkerStore();

  const { map } = useMapStore();
  const { openAlert } = useAlertStore();

  const [registerValue, setRegisterValue] = useState<RegisterValue>({
    photos: null,
    latitude: null,
    longitude: null,
    description: null,
    step: 0,
    facilities: [
      {
        facilityId: 1,
        quantity: 0,
      },
      {
        facilityId: 2,
        quantity: 0,
      },
    ],
  });

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("location");

  const [errorMessage, setErrorMessage] = useState("");

  const [marker, setMarker] = useState<KakaoMarker | null>(null);

  const [newMarkerId, setNewMarkerId] = useState<number | null>(null);
  const submitRequestedRef = useRef(false);

  const [initPhotos, setInintPhotos] = useState<ImageUploadState[] | null>(
    null
  );

  const headerTitle = useMemo(() => {
    if (registerValue.step === 0) return "위치 선택";
    if (registerValue.step === 1) return "기구 개수 등록";
    if (registerValue.step === 2) return "설명 등록";
    if (registerValue.step === 3) return "이미지 등록";
  }, [registerValue.step]);

  useEffect(() => {
    const images = [
      "/congratulations.gif",
      "/error.gif",
      "/upload.gif",
      "/gopher.gif",
      "/signup-loading.gif",
    ];

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (registerValue.step !== 4) {
      submitRequestedRef.current = false;
      return;
    }
    if (!map || submitRequestedRef.current) return;
    submitRequestedRef.current = true;

    const fetch = async () => {
      if (!registerValue.latitude || !registerValue.longitude) {
        submitRequestedRef.current = false;
        return;
      }

      const response = await setNewMarker({
        description: registerValue.description || "",
        latitude: registerValue.latitude,
        longitude: registerValue.longitude,
        photos: registerValue.photos || [],
      });

      if (!response.ok) {
        if (response.status === 409) {
          setErrorMessage(registerError[409]);
        } else if (response.status === 401) {
          setErrorMessage(registerError[401]);
        } else if (response.status === 403) {
          setErrorMessage(registerError[403]);
        } else if (response.status === 400) {
          setErrorMessage(registerError[400]);
        } else if (response.status === 422) {
          setErrorMessage(registerError[422]);
        } else {
          setErrorMessage("잠시 후 다시 시도해주세요");
        }
        setUploadStatus("error");
        return;
      }

      const newMarker = (await response.json()) as SetMarkerRes;
      if (uploadStatus === "image") {
        await wait(1.2);
        setUploadStatus("location");
      }
      await wait(0.6);
      if (
        registerValue.facilities[0].quantity > 0 ||
        registerValue.facilities[1].quantity > 0
      ) {
        setUploadStatus("facilities");
      }
      const responseFac = await setNewFacilities({
        markerId: newMarker.markerId,
        facilities: [
          {
            facilityId: 1,
            quantity: registerValue.facilities[0].quantity,
          },
          {
            facilityId: 2,
            quantity: registerValue.facilities[1].quantity,
          },
        ],
      });

      if (!responseFac.ok) {
        setErrorMessage("잠시 후 다시 시도해주세요.");
        setUploadStatus("error");
        return;
      }

      setNewMarkerId(newMarker.markerId);

      marker?.setMap(null);

      if (registerValue.photos && registerValue.photos.length > 0) {
        setMarkerToStore([{ ...newMarker, hasPhoto: true }]);
      } else {
        setMarkerToStore([newMarker]);
      }

      map.setCenter(
        new window.kakao.maps.LatLng(newMarker.latitude, newMarker.longitude)
      );

      await wait(0.7);
      setUploadStatus("complete");
    };

    fetch();
  }, [
    setUser,
    setMarkerToStore,
    registerValue.step,
    registerValue.description,
    registerValue.latitude,
    registerValue.longitude,
    registerValue.photos,
    registerValue.facilities,
    map,
    marker,
    uploadStatus,
  ]);

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
    });

    marker.setMap(map);
    marker.setVisible(false);

    setMarker(marker);

    return () => {
      marker.setMap(null);
    };
  }, [map]);

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

    if (photos) {
      const sizeMap = photos.map((photo) => {
        return photo.size / (1024 * 1024);
      });
      const totalSize = sizeMap.reduce((a, b) => a + b);

      if (totalSize > 28) {
        openAlert({
          title: "이미지 용량 초과",
          description: "최대 30MB까지 이미지를 등록할 수 있습니다.",
          onClick: () => {},
        });
        return;
      }
    }

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
    if (registerValue.step === 0) {
      if (referrer) {
        router.back();
      } else {
        router.push("/");
      }
    } else {
      setRegisterValue((prev) => ({ ...prev, step: prev.step - 1 }));
    }
  };

  const changeInitPhoto = (photo: ImageUploadState) => {
    if (initPhotos) {
      setInintPhotos((prev) => [...(prev as ImageUploadState[]), photo]);
    } else {
      setInintPhotos([photo]);
    }
  };
  const deleteInitPhoto = (id: string) => {
    if (!initPhotos) return;
    const filtered = initPhotos.filter((image) => image.id !== id);

    if (filtered.length === 0) {
      setInintPhotos(null);
    } else {
      setInintPhotos([...filtered]);
    }
  };

  const setDescription = (desc: string | null) => {
    setRegisterValue((prev) => ({ ...prev, description: desc }));
  };

  const setPosition = (position: {
    lat: number | null;
    lng: number | null;
  }) => {
    setRegisterValue((prev) => ({
      ...prev,
      latitude: position.lat,
      longitude: position.lng,
    }));
  };

  const increaseFacilities = (id: number) => {
    let 철봉 = registerValue.facilities[0].quantity;
    let 평행봉 = registerValue.facilities[1].quantity;
    if (id === 1) {
      let facilities = [
        { facilityId: 1, quantity: 철봉 + 1 },
        { facilityId: 2, quantity: 평행봉 },
      ];
      setRegisterValue((prev) => ({ ...prev, facilities }));
    } else {
      let facilities = [
        { facilityId: 1, quantity: 철봉 },
        { facilityId: 2, quantity: 평행봉 + 1 },
      ];
      setRegisterValue((prev) => ({ ...prev, facilities }));
    }
  };

  const decreaseFacilities = (id: number) => {
    let 철봉 = registerValue.facilities[0].quantity;
    let 평행봉 = registerValue.facilities[1].quantity;
    if (id === 1) {
      let facilities = [
        { facilityId: 1, quantity: 철봉 - 1 },
        { facilityId: 2, quantity: 평행봉 },
      ];
      setRegisterValue((prev) => ({ ...prev, facilities }));
    } else {
      let facilities = [
        { facilityId: 1, quantity: 철봉 },
        { facilityId: 2, quantity: 평행봉 - 1 },
      ];
      setRegisterValue((prev) => ({ ...prev, facilities }));
    }
  };

  const resetStep = () => {
    setRegisterValue((prev) => ({
      ...prev,
      step: 0,
    }));
    setUploadStatus("location");
  };
  const setStep = (step: number) => {
    setRegisterValue((prev) => ({
      ...prev,
      step: step,
    }));
    setUploadStatus("location");
  };

  if (!isMounted || !user) {
    return (
      <SideMain
        headerTitle="위치 등록"
        prevClick={() => {}}
        hasBackButton
        withNav
        dragable={false}
        deviceType={deviceType}
      >
        <div className="flex h-full flex-col px-6 pt-5">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="mt-4 h-5 w-2/3 rounded-md" />
          <Skeleton className="mt-2 h-4 w-full rounded-md" />
          <Skeleton className="mt-2 h-4 w-5/6 rounded-md" />
          <div className="grow" />
          <Skeleton className="mb-2 h-11 w-full rounded-md" />
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
        deviceType={deviceType}
        withNav
      />
    );
  }

  return (
    <SideMain
      headerTitle={headerTitle}
      prevClick={handlePrev}
      hasBackButton
      withNav={registerValue.step === 4 ? false : true}
      className={registerValue.step === 0 ? "duration-300" : ""}
      dragable={false}
      bodyStyle={deviceType === "ios-mobile-app" ? "pb-0 mo:pb-0 mb-24" : "pb-0 mo:pb-0 mb-2"}
      deviceType={deviceType}
    >
      <div className="page-transition h-full">
        {registerValue.step === 0 && (
          <SelectLocation
            next={handleLocationChange}
            marker={marker as KakaoMarker}
            position={{
              lat: registerValue.latitude,
              lng: registerValue.longitude,
            }}
            setPosition={setPosition}
          />
        )}
        {registerValue.step === 1 && (
          <SetFacilities
            next={handleNext}
            increase={increaseFacilities}
            decrease={decreaseFacilities}
            철봉={registerValue.facilities[0].quantity}
            평행봉={registerValue.facilities[1].quantity}
          />
        )}
        {registerValue.step === 2 && (
          <SetDescription
            next={handleDescChange}
            description={registerValue.description}
            setDescription={setDescription}
          />
        )}
        {registerValue.step === 3 && (
          <UploadImage
            next={handleImageChange}
            title={[
              "정확한 이미지를 등록해 주시면,",
              "다른 사람이 해당 위치를 찾는 데 큰 도움이 됩니다!",
            ]}
            initPhotos={initPhotos}
            setInintPhotos={changeInitPhoto}
            deleteInintPhotos={deleteInitPhoto}
          />
        )}
        {registerValue.step === 4 && (
          <UploadComplete
            status={uploadStatus}
            returnUrl={`/pullup/${newMarkerId}`}
            errorMessage={errorMessage}
            resetStep={resetStep}
            setStep={setStep}
          />
        )}
      </div>
    </SideMain>
  );
};

export default RegisterClient;
