/**
 * LRU Cache for geocoding results with sessionStorage persistence
 * - Keys are rounded to 4 decimals (~11m precision)
 * - TTL: 24 hours
 * - Max 200 entries
 */

export interface CachedRegion {
  address_name: string;
  code: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_4depth_name: string;
  region_type: string;
  timestamp: number;
}

interface CacheEntry {
  data: CachedRegion;
  timestamp: number;
}

const MAX_CACHE_SIZE = 200;
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const STORAGE_KEY = "addressCacheV1";

class AddressCache {
  private cache: Map<string, CacheEntry>;

  constructor() {
    this.cache = new Map();
    this.loadFromStorage();
  }

  /**
   * Round coordinates to 4 decimals (~11m precision)
   */
  private getCacheKey(lat: number, lng: number): string {
    return `${lat.toFixed(4)}:${lng.toFixed(4)}`;
  }

  /**
   * Check if cached entry is still valid (within TTL)
   */
  private isValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < TTL_MS;
  }

  /**
   * Get cached region data if available and valid
   */
  get(lat: number, lng: number): CachedRegion | null {
    const key = this.getCacheKey(lat, lng);
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (!this.isValid(entry)) {
      // Remove expired entry
      this.cache.delete(key);
      return null;
    }

    // Move to end (LRU - most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.data;
  }

  /**
   * Store region data in cache
   */
  set(lat: number, lng: number, data: CachedRegion): void {
    const key = this.getCacheKey(lat, lng);
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
    };

    // If cache is full, remove oldest entry (first item in Map)
    if (this.cache.size >= MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, entry);
    this.saveToStorage();
  }

  /**
   * Load cache from sessionStorage
   */
  private loadFromStorage(): void {
    if (typeof window === "undefined") return;

    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const parsed: [string, CacheEntry][] = JSON.parse(stored);
      const now = Date.now();

      // Only load valid entries
      for (const [key, entry] of parsed) {
        if (now - entry.timestamp < TTL_MS) {
          this.cache.set(key, entry);
        }
      }
    } catch (error) {
      console.warn("Failed to load address cache from storage:", error);
    }
  }

  /**
   * Save cache to sessionStorage
   */
  private saveToStorage(): void {
    if (typeof window === "undefined") return;

    try {
      const entries = Array.from(this.cache.entries());
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.warn("Failed to save address cache to storage:", error);
    }
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.cache.clear();
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.warn("Failed to clear address cache storage:", error);
      }
    }
  }

  /**
   * Get current cache size
   */
  size(): number {
    return this.cache.size;
  }
}

// Singleton instance
export const addressCache = new AddressCache();
