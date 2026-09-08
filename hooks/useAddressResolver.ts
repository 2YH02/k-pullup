import getAddress from "@api/common/get-address";
import { addressCache, type CachedRegion } from "@lib/address-cache";
import { useCallback, useRef, useState } from "react";

const DEBOUNCE_MS = 500;

interface ResolveResult {
  success: boolean;
  data?: CachedRegion;
  error?: string;
}

export const useAddressResolver = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const requestToken = useRef<number>(0);

  /**
   * Resolve address with debouncing and caching
   * Returns immediately from cache if available
   * Otherwise debounces the API call
   */
  const resolve = useCallback(
    (lat: number, lng: number): Promise<ResolveResult> => {
      // Check cache first
      const cached = addressCache.get(lat, lng);
      if (cached) {
        setError(null);
        return Promise.resolve({ success: true, data: cached });
      }

      // Return a promise that will resolve after debounce
      return new Promise((resolvePromise) => {
        // Clear previous debounce timer
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }

        // Increment token to track latest request
        const currentToken = ++requestToken.current;

        // Start debounce
        debounceTimer.current = setTimeout(async () => {
          setLoading(true);
          setError(null);

          try {
            const response = await getAddress({ lat, lng });

            // Ignore if this is not the latest request
            if (currentToken !== requestToken.current) {
              resolvePromise({ success: false, error: "Request cancelled" });
              return;
            }

            if (response.code === -2) {
              const errorMsg = "위치 정보 없음";
              setError(errorMsg);
              setLoading(false);
              resolvePromise({ success: false, error: errorMsg });
              return;
            }

            if (!response.documents || response.documents.length === 0) {
              const errorMsg = "주소를 찾을 수 없습니다";
              setError(errorMsg);
              setLoading(false);
              resolvePromise({ success: false, error: errorMsg });
              return;
            }

            const {
              address_name,
              code,
              region_1depth_name,
              region_2depth_name,
              region_3depth_name,
              region_4depth_name,
              region_type,
            } = response.documents[0];

            const regionData: CachedRegion = {
              address_name,
              code,
              region_1depth_name,
              region_2depth_name,
              region_3depth_name,
              region_4depth_name,
              region_type,
              timestamp: Date.now(),
            };

            // Store in cache
            addressCache.set(lat, lng, regionData);

            setLoading(false);
            setError(null);
            resolvePromise({ success: true, data: regionData });
          } catch (err) {
            // Ignore if this is not the latest request
            if (currentToken !== requestToken.current) {
              resolvePromise({ success: false, error: "Request cancelled" });
              return;
            }

            const errorMsg =
              err instanceof Error ? err.message : "주소 조회 실패";
            setError(errorMsg);
            setLoading(false);
            resolvePromise({ success: false, error: errorMsg });
          }
        }, DEBOUNCE_MS);
      });
    },
    []
  );

  /**
   * Cancel any pending requests
   */
  const cancel = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    // 최신 요청 판별은 requestToken 으로 처리한다. cancel 이후 진행 중이던
    // 요청 결과는 token 불일치로 무시된다.
    requestToken.current++;
    setLoading(false);
  }, []);

  return {
    resolve,
    cancel,
    loading,
    error,
  };
};
