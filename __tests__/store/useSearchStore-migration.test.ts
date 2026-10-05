// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import useSearchStore from "@store/useSearchStore";

/**
 * useSearchStore persist migration (v0 → v1)
 *
 * v0 은 markerId 를 `d` 필드에 저장했다. 기존 사용자의 검색 기록이
 * 재수화(rehydrate) 시 markerId 로 옮겨져야 한다.
 */

const STORAGE_KEY = "search-history";

describe("useSearchStore migration", () => {
  beforeEach(() => {
    localStorage.clear();
    useSearchStore.setState({ searches: [] });
  });

  it("v0 의 d 필드를 markerId 로 옮기고 d 는 제거한다", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 0,
        state: {
          searches: [
            { addr: "서울 중구", place: "철봉", d: 123, lat: "37.5", lng: "126.9" },
            { addr: "부산 해운대구", d: null },
            { addr: "대전 서구" },
          ],
        },
      })
    );

    await useSearchStore.persist.rehydrate();

    const { searches } = useSearchStore.getState();
    expect(searches).toEqual([
      { addr: "서울 중구", place: "철봉", markerId: 123, lat: "37.5", lng: "126.9" },
      { addr: "부산 해운대구", markerId: null },
      { addr: "대전 서구", markerId: null },
    ]);
    searches.forEach((s) => expect(s).not.toHaveProperty("d"));
  });

  it("v1 데이터는 그대로 복원한다", async () => {
    const searches = [{ addr: "서울 중구", markerId: 7 }];
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, state: { searches } })
    );

    await useSearchStore.persist.rehydrate();

    expect(useSearchStore.getState().searches).toEqual(searches);
  });

  it("새로 저장되는 데이터는 version 1 로 기록된다", () => {
    useSearchStore.getState().addSearch({ addr: "인천 남동구", markerId: 1 });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    expect(stored.version).toBe(1);
    expect(stored.state.searches[0]).toEqual({ addr: "인천 남동구", markerId: 1 });
  });
});
