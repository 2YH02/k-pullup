/**
 * Browser cache for roadview shot dates
 * Uses localStorage for persistence across sessions
 */

interface CacheEntry {
  shot_date: string;
  cachedAt: number; // timestamp
}

const CACHE_KEY_PREFIX = "roadview_date_";
const CACHE_EXPIRY_DAYS = 90; // 90 days - shot dates are historical and won't change

/**
 * Generate cache key from coordinates
 * Rounds to 6 decimal places (~0.11m precision) to allow cache hits for nearby coordinates
 */
const getCacheKey = (lat: number, lng: number): string => {
  const roundedLat = lat.toFixed(6);
  const roundedLng = lng.toFixed(6);
  return `${CACHE_KEY_PREFIX}${roundedLat}_${roundedLng}`;
};

/**
 * Check if cache entry is expired
 */
const isExpired = (cachedAt: number): boolean => {
  const now = Date.now();
  const expiryMs = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  return now - cachedAt > expiryMs;
};

/**
 * Get cached roadview date
 * Returns null if not cached or expired
 */
export const getCachedRoadviewDate = (
  lat: number,
  lng: number
): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const key = getCacheKey(lat, lng);
    const cached = localStorage.getItem(key);

    if (!cached) return null;

    const entry: CacheEntry = JSON.parse(cached);

    if (isExpired(entry.cachedAt)) {
      // Clean up expired entry
      localStorage.removeItem(key);
      return null;
    }

    return entry.shot_date;
  } catch (error) {
    // Handle localStorage errors (quota exceeded, disabled, etc.)
    console.warn("Failed to read roadview date cache:", error);
    return null;
  }
};

/**
 * Cache roadview date
 */
export const cacheRoadviewDate = (
  lat: number,
  lng: number,
  shot_date: string
): void => {
  if (typeof window === "undefined") return;

  try {
    const key = getCacheKey(lat, lng);
    const entry: CacheEntry = {
      shot_date,
      cachedAt: Date.now(),
    };

    localStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    // Handle localStorage errors silently
    console.warn("Failed to cache roadview date:", error);
  }
};

/**
 * Clear all roadview date cache (optional - for debugging/maintenance)
 */
export const clearRoadviewDateCache = (): void => {
  if (typeof window === "undefined") return;

  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn("Failed to clear roadview date cache:", error);
  }
};
