/**
 * Kakao Maps Geocoding utilities with in-memory caching
 * Converts coordinates to human-readable addresses
 */

interface GeocodingResult {
  address: string;
  shortAddress: string; // e.g., "경기도 수원시"
}

// In-memory cache for geocoding results
const geocodeCache = new Map<string, GeocodingResult>();

// Rate limiting: max requests per second
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 100; // 100ms between requests

/**
 * Generate cache key from coordinates
 */
const getCacheKey = (lat: number, lng: number): string => {
  // Round to 5 decimal places (~1m precision) for cache efficiency
  return `${lat.toFixed(5)},${lng.toFixed(5)}`;
};

/**
 * Wait for rate limiting
 */
const waitForRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }

  lastRequestTime = Date.now();
};

/**
 * Convert coordinates to address using Kakao Maps Geocoder
 * Results are cached in memory to reduce API calls
 */
export const coordToAddress = async (
  lat: number,
  lng: number
): Promise<GeocodingResult> => {
  const cacheKey = getCacheKey(lat, lng);

  // Check cache first
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  // Rate limiting
  await waitForRateLimit();

  return new Promise((resolve, reject) => {
    if (!window.kakao || !window.kakao.maps) {
      reject(new Error("Kakao Maps not loaded"));
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.coord2Address(lng, lat, (geocodeData: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const address = geocodeData[0].address;
        const roadAddress = geocodeData[0].road_address;

        // Prefer road address, fallback to land address
        const fullAddress = roadAddress
          ? roadAddress.address_name
          : address.address_name;

        // Extract short address (시/도 + 시/군/구)
        const shortAddress = roadAddress
          ? `${address.region_1depth_name} ${address.region_2depth_name}`
          : `${address.region_1depth_name} ${address.region_2depth_name}`;

        const result: GeocodingResult = {
          address: fullAddress,
          shortAddress: shortAddress.trim(),
        };

        // Cache the result
        geocodeCache.set(cacheKey, result);

        resolve(result);
      } else {
        // Fallback: just show coordinates
        const fallback: GeocodingResult = {
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          shortAddress: "위치 정보 없음",
        };
        geocodeCache.set(cacheKey, fallback);
        resolve(fallback);
      }
    });
  });
};

/**
 * Batch geocode multiple coordinates
 * Uses cache and rate limiting
 */
export const batchCoordToAddress = async (
  coords: Array<{ lat: number; lng: number }>
): Promise<Map<string, GeocodingResult>> => {
  const results = new Map<string, GeocodingResult>();

  for (const { lat, lng } of coords) {
    const cacheKey = getCacheKey(lat, lng);

    try {
      const result = await coordToAddress(lat, lng);
      results.set(cacheKey, result);
    } catch (error) {
      console.error(`Geocoding failed for ${lat}, ${lng}:`, error);
      // Set fallback
      results.set(cacheKey, {
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        shortAddress: "위치 정보 없음",
      });
    }
  }

  return results;
};

/**
 * Clear geocode cache (useful for memory management)
 */
export const clearGeocodeCache = (): void => {
  geocodeCache.clear();
};

/**
 * Get cache size
 */
export const getGeocacheCacheSize = (): number => {
  return geocodeCache.size;
};
