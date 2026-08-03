import useGeolocationStore from "@store/useGeolocationStore";

interface UseRegionAddress {
  /** 표시용 주소 텍스트 (예: "강남구 역삼동") */
  addressText: string;
  /** 주소 로딩 중 여부 */
  isLoading: boolean;
  /** 위치 정보가 유효한지 여부 */
  hasRegion: boolean;
}

const FALLBACK_TEXT = "위치 정보 없음";

/**
 * Geolocation store의 region 데이터를 표시용 주소 텍스트로 변환하는 훅.
 * location-badge, around-client 등에서 공통으로 사용.
 */
const useRegionAddress = (): UseRegionAddress => {
  const region = useGeolocationStore((s) => s.region);
  const regionLoading = useGeolocationStore((s) => s.regionLoading);
  const geoLocationError = useGeolocationStore((s) => s.geoLocationError);

  const hasRegion = !!region && !geoLocationError;

  const addressText = hasRegion
    ? region.region_2depth_name !== "" || region.region_3depth_name !== ""
      ? `${region.region_2depth_name} ${region.region_3depth_name}`
      : region.address_name || FALLBACK_TEXT
    : FALLBACK_TEXT;

  return {
    addressText,
    isLoading: regionLoading,
    hasRegion,
  };
};

export default useRegionAddress;
