import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { clusterMarkers } from "@lib/cluster-markers";
import type { MarkerRes } from "@api/marker/get-all-marker";

/**
 * clusterMarkers: 격자(cellSize) 기반 마커 클러스터링
 *
 * - 모든 마커는 정확히 하나의 그룹에 속한다 (count 총합 보존)
 * - 그룹 중심은 해당 격자 셀 내부에 위치한다 (셀 내 좌표 평균)
 */

const markerArb: fc.Arbitrary<MarkerRes> = fc.record({
  markerId: fc.integer({ min: 1, max: 1_000_000 }),
  // 대한민국 대략 범위
  latitude: fc.double({ min: 33, max: 39, noNaN: true }),
  longitude: fc.double({ min: 124, max: 132, noNaN: true }),
  address: fc.string(),
  hasPhoto: fc.boolean(),
});

const cellSizeArb = fc.constantFrom(0.01, 0.05, 0.1, 0.5, 1);

describe("clusterMarkers", () => {
  it("count 총합은 입력 마커 수와 같다", () => {
    fc.assert(
      fc.property(fc.array(markerArb, { maxLength: 100 }), cellSizeArb, (markers, cellSize) => {
        const groups = clusterMarkers(markers, cellSize);
        const total = groups.reduce((sum, g) => sum + g.count, 0);

        expect(total).toBe(markers.length);
        expect(groups.length).toBeLessThanOrEqual(markers.length);
      })
    );
  });

  it("각 그룹은 한 격자 셀의 마커들이며, 중심은 그 마커들의 좌표 평균이다", () => {
    fc.assert(
      fc.property(fc.array(markerArb, { minLength: 1, maxLength: 100 }), cellSizeArb, (markers, cellSize) => {
        // 기준값: 셀 key 별로 직접 묶은 결과
        const cells = new Map<string, MarkerRes[]>();
        markers.forEach((m) => {
          const key = `${Math.floor(m.longitude / cellSize)},${Math.floor(m.latitude / cellSize)}`;
          cells.set(key, [...(cells.get(key) ?? []), m]);
        });
        const expected = Array.from(cells.values()).map((members: MarkerRes[]) => ({
          count: members.length,
          lat: members.reduce((s, m) => s + m.latitude, 0) / members.length,
          lng: members.reduce((s, m) => s + m.longitude, 0) / members.length,
          minLat: Math.min(...members.map((m) => m.latitude)),
          maxLat: Math.max(...members.map((m) => m.latitude)),
        }));

        const groups = clusterMarkers(markers, cellSize);

        expect(groups).toHaveLength(expected.length);
        groups.forEach((g, i) => {
          // Object.values 는 삽입 순서를 따르므로 첫 등장 순서대로 대응된다
          expect(g.count).toBe(expected[i].count);
          expect(g.centerLatitude).toBeCloseTo(expected[i].lat, 9);
          expect(g.centerLongitude).toBeCloseTo(expected[i].lng, 9);
          expect(g.centerLatitude).toBeGreaterThanOrEqual(expected[i].minLat - 1e-9);
          expect(g.centerLatitude).toBeLessThanOrEqual(expected[i].maxLat + 1e-9);
        });
      })
    );
  });

  it("같은 셀의 두 마커는 하나의 그룹으로 묶이고 중심은 평균이다", () => {
    const markers: MarkerRes[] = [
      { markerId: 1, latitude: 37.51, longitude: 127.01, address: "", hasPhoto: false },
      { markerId: 2, latitude: 37.53, longitude: 127.03, address: "", hasPhoto: true },
    ];

    const groups = clusterMarkers(markers, 0.1);

    expect(groups).toHaveLength(1);
    expect(groups[0].count).toBe(2);
    expect(groups[0].centerLatitude).toBeCloseTo(37.52);
    expect(groups[0].centerLongitude).toBeCloseTo(127.02);
  });

  it("빈 배열이면 빈 결과를 반환한다", () => {
    expect(clusterMarkers([], 0.1)).toEqual([]);
  });
});
