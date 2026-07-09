import { describe, it, expect, beforeEach } from "vitest";
import * as fc from "fast-check";
import useMapStore from "@store/useMapStore";
import type { KakaoMarker, KakaoOverlay } from "@/types/kakao-map.types";

/**
 * Property 5: Append semantics preserve existing entries
 *
 * For any initial array of items and any new item(s) to append,
 * calling an append setter (appendMarkers or appendOverlay) SHALL result in a state where
 * all original items remain present and the new item(s) appear at the end,
 * with the total length equal to the original length plus the number of new items.
 *
 * **Validates: Requirements 4.5, 4.7**
 */

const createMockMarker = (): KakaoMarker => ({
  setMap: () => {},
  setPosition: () => {},
  getPosition: () => ({ La: 0, Ma: 0 }),
  setImage: () => {},
  getTitle: () => "",
  setVisible: () => {},
  setClickable: () => {},
  Gb: "",
});

const createMockOverlay = (): KakaoOverlay => ({
  setMap: () => {},
});

describe("Feature: fetchdata-error-handling, Property 5: Append semantics preserve existing entries", () => {
  beforeEach(() => {
    useMapStore.setState({ markers: [], overlays: [] });
  });

  it("appendMarkers: total length equals initial + new, and initial markers are preserved", () => {
    fc.assert(
      fc.property(
        fc.array(fc.constant(null).map(() => createMockMarker()), { minLength: 0, maxLength: 10 }),
        fc.array(fc.constant(null).map(() => createMockMarker()), { minLength: 0, maxLength: 10 }),
        (initialMarkers, newMarkers) => {
          // Set initial state
          useMapStore.setState({ markers: initialMarkers });

          // Call appendMarkers
          useMapStore.getState().appendMarkers(newMarkers);

          const resultMarkers = useMapStore.getState().markers;

          // Assert total length = initial + new
          expect(resultMarkers.length).toBe(
            initialMarkers.length + newMarkers.length
          );

          // Assert initial markers are still present at the beginning
          for (let i = 0; i < initialMarkers.length; i++) {
            expect(resultMarkers[i]).toBe(initialMarkers[i]);
          }

          // Assert new markers appear at the end
          for (let i = 0; i < newMarkers.length; i++) {
            expect(resultMarkers[initialMarkers.length + i]).toBe(
              newMarkers[i]
            );
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it("appendOverlay: total length equals initial + 1, and existing overlays are preserved", () => {
    fc.assert(
      fc.property(
        fc.array(fc.constant(null).map(() => createMockOverlay()), { minLength: 0, maxLength: 10 }),
        fc.constant(null).map(() => createMockOverlay()),
        (initialOverlays, newOverlay) => {
          // Set initial state
          useMapStore.setState({ overlays: initialOverlays });

          // Call appendOverlay with a single item
          useMapStore.getState().appendOverlay(newOverlay);

          const resultOverlays = useMapStore.getState().overlays;

          // Assert length increased by 1
          expect(resultOverlays.length).toBe(initialOverlays.length + 1);

          // Assert existing overlays are preserved at the beginning
          for (let i = 0; i < initialOverlays.length; i++) {
            expect(resultOverlays[i]).toBe(initialOverlays[i]);
          }

          // Assert new overlay is at the end
          expect(resultOverlays[resultOverlays.length - 1]).toBe(newOverlay);
        }
      ),
      { numRuns: 20 }
    );
  });
});
