import useAlertStore from "@store/useAlertStore";
import useGeolocationStore, { type Location } from "@store/useGeolocationStore";
import { useState } from "react";

const useGps = () => {
  const { myLocation } = useGeolocationStore();
  const { openAlert } = useAlertStore();

  const [location, setLocation] = useState<Location | null>(null);

  const handleGps = () => {
    if (!myLocation) {
      const setPosition = (position: GeolocationPosition) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      };

      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            setPosition(position);
          },
          (err) => {
            console.error(err);
            openAlert({
              title: "위치 서비스 사용",
              description:
                "위치 서비스를 사용할 수 없습니다. 브라우저 설정에서 위치서비스를 켜주세요.",
              onClick: () => {},
            });
          }
        );
      }

      return location;
    }

    return myLocation;
  };

  return { handleGps };
};

export default useGps;
