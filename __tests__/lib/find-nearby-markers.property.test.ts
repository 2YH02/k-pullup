import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { findNearbyMarkers } from "@lib/find-nearby-markers";
import { haversineDistanceKm } from "@lib/geo-utils";
import type { MarkerRes } from "@api/marker/get-all-marker";

/**
 * findNearbyMarkers: 기준 좌표로부터 maxDistance(km) 이내 마커 필터링
 *
 * - 결과는 입력의 부분집합이며 순서를 유지한다
 * - 결과에 포함된 마커는 모두 maxDistance 이내, 제외된 마커는 모두 초과
 */

const markerArb: fc.Arbitrary<MarkerRes> = fc.record({
  markerId: fc.integer({ min: 1, max: 1_000_000 }),
  latitude: fc.double({ min: 33, max: 39, noNaN: true }),
  longitude: fc.double({ min: 124, max: 132, noNaN: true }),
  address: fc.string(),
  hasPhoto: fc.boolean(),
});

const latArb = fc.double({ min: 33, max: 39, noNaN: true });
const lngArb = fc.double({ min: 124, max: 132, noNaN: true });
const distanceArb = fc.double({ min: 0, max: 500, noNaN: true });

describe("findNearbyMarkers", () => {
  it("포함/제외가 haversine 거리 기준과 정확히 일치한다", () => {
    fc.assert(
      fc.property(
        fc.array(markerArb, { maxLength: 50 }),
        latArb,
        lngArb,
        distanceArb,
        (markers, latitude, longitude, maxDistance) => {
          const result = findNearbyMarkers({ markers, latitude, longitude, maxDistance });

          markers.forEach((m) => {
            const d = haversineDistanceKm(latitude, longitude, m.latitude, m.longitude);
            expect(result.includes(m)).toBe(d <= maxDistance);
          });
        }
      )
    );
  });

  it("결과는 입력 순서를 유지하는 부분집합이다", () => {
    fc.assert(
      fc.property(
        fc.array(markerArb, { maxLength: 50 }),
        latArb,
        lngArb,
        distanceArb,
        (markers, latitude, longitude, maxDistance) => {
          const result = findNearbyMarkers({ markers, latitude, longitude, maxDistance });
          const indices = result.map((m) => markers.indexOf(m));

          expect(indices.every((i) => i >= 0)).toBe(true);
          expect([...indices].sort((a, b) => a - b)).toEqual(indices);
        }
      )
    );
  });

  it("기준점과 같은 좌표의 마커는 maxDistance 0 에서도 포함된다", () => {
    const marker: MarkerRes = {
      markerId: 1,
      latitude: 37.5665,
      longitude: 126.978,
      address: "",
      hasPhoto: false,
    };

    const result = findNearbyMarkers({
      markers: [marker],
      latitude: 37.5665,
      longitude: 126.978,
      maxDistance: 0,
    });

    expect(result).toEqual([marker]);
  });

  it("서울시청–강남역(약 8.8km)은 5km 에서 제외, 10km 에서 포함된다", () => {
    const gangnam: MarkerRes = {
      markerId: 2,
      latitude: 37.4979,
      longitude: 127.0276,
      address: "",
      hasPhoto: false,
    };
    const cityHall = { latitude: 37.5665, longitude: 126.978 };

    expect(findNearbyMarkers({ markers: [gangnam], ...cityHall, maxDistance: 5 })).toEqual([]);
    expect(findNearbyMarkers({ markers: [gangnam], ...cityHall, maxDistance: 10 })).toEqual([gangnam]);
  });
});
