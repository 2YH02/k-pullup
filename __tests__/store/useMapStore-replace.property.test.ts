import { describe, it, expect, beforeEach } from "vitest";
import * as fc from "fast-check";
import useMapStore from "@store/useMapStore";
import type { KakaoMarker, KakaoOverlay } from "@/types/kakao-map.types";

/**
 * Property 6: Replace semantics set state to exactly the provided data
 *
 * For any initial array of items and any replacement array,
 * calling a replace setter (replaceMarkers or replaceOverlays)
 * SHALL result in a state that is strictly equal to the replacement array,
 * regardless of the previous state content.
 *
 * **Validates: Requirements 4.6, 4.8**
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

describe("Feature: fetchdata-error-handling, Property 6: Replace semantics set state to exactly the provided data", () => {
  beforeEach(() => {
    useMapStore.setState({ markers: [], overlays: [] });
  });

  it("replaceMarkers should set state to exactly the provided markers regardless of initial state", () => {
    fc.assert(
      fc.property(
        fc.array(fc.constant(null).map(() => createMockMarker()), { minLength: 0, maxLength: 10 }),
        fc.array(fc.constant(null).map(() => createMockMarker()), { minLength: 0, maxLength: 10 }),
        (initialMarkers, replacementMarkers) => {
          // Set initial state
          useMapStore.setState({ markers: initialMarkers });

          // Call replaceMarkers
          useMapStore.getState().replaceMarkers(replacementMarkers);

          // Assert state is exactly the replacement array
          const state = useMapStore.getState();
          expect(state.markers).toStrictEqual(replacementMarkers);
          expect(state.markers.length).toBe(replacementMarkers.length);
        }
      ),
      { numRuns: 20 }
    );
  });

  it("replaceOverlays should set state to exactly the provided overlays regardless of initial state", () => {
    fc.assert(
      fc.property(
        fc.array(fc.constant(null).map(() => createMockOverlay()), { minLength: 0, maxLength: 10 }),
        fc.array(fc.constant(null).map(() => createMockOverlay()), { minLength: 0, maxLength: 10 }),
        (initialOverlays, replacementOverlays) => {
          // Set initial state
          useMapStore.setState({ overlays: initialOverlays });

          // Call replaceOverlays
          useMapStore.getState().replaceOverlays(replacementOverlays);

          // Assert state is exactly the replacement array
          const state = useMapStore.getState();
          expect(state.overlays).toStrictEqual(replacementOverlays);
          expect(state.overlays.length).toBe(replacementOverlays.length);
        }
      ),
      { numRuns: 20 }
    );
  });
});
