import useGeolocationStore, { type Location } from "@store/useGeolocationStore";

/**
 * 현재 위치를 Promise 로 반환한다.
 *
 * 기존 `useGps` 훅은 watchPosition 을 시작한 뒤 stale 한 useState 값을 동기
 * 반환해 "첫 클릭 무동작 + 클릭마다 watcher 누적(해제 없음)" 문제가 있었다. (P2-3)
 * 이 헬퍼는 스토어에 캐시된 위치가 있으면 그대로 쓰고, 없으면 getCurrentPosition
 * 으로 1회 조회한다. watcher 를 남기지 않는다.
 */
const getMyLocation = (): Promise<Location | null> => {
  const cached = useGeolocationStore.getState().myLocation;
  if (cached) {
    return Promise.resolve(cached);
  }

  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // 다음 호출을 위해 캐시에 저장
        useGeolocationStore.getState().setMyLocation(location);
        resolve(location);
      },
      () => {
        resolve(null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
};

export default getMyLocation;
