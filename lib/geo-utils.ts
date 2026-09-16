/**
 * Haversine formula — 두 좌표 사이의 구면 거리 계산
 *
 * @returns 킬로미터(km) 단위 거리
 *
 * 미터가 필요하면 호출부에서 × 1000 하세요.
 * (admin-utils의 calculateDistance는 meters 반환이 필요하여 × 1000을 래핑합니다)
 */
export const haversineDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
