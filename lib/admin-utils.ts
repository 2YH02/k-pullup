/**
 * Admin utility functions for report management
 */

import { haversineDistanceKm } from "@lib/geo-utils";

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in meters
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  return haversineDistanceKm(lat1, lon1, lat2, lon2) * 1000;
};

/**
 * Format distance for display
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1) {
    return `${Math.round(meters * 100)}cm`;
  } else if (meters < 1000) {
    return `${Math.round(meters)}m`;
  } else {
    return `${(meters / 1000).toFixed(2)}km`;
  }
};

/**
 * Format date for Korean locale
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format relative time (e.g., "2시간 전", "3일 전")
 */
export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
  return `${Math.floor(diffDays / 365)}년 전`;
};

/**
 * Check if report is high priority (equipment removed, dangerous, etc.)
 */
export const isHighPriority = (description: string): boolean => {
  const keywords = ["없음", "철거", "제거", "위험", "파손", "삭제"];
  return keywords.some((keyword) =>
    description.toLowerCase().includes(keyword)
  );
};

/**
 * Extract priority level from description
 */
export const getPriorityLevel = (
  description: string
): "high" | "medium" | "low" => {
  if (isHighPriority(description)) return "high";
  if (description.length > 20) return "medium";
  return "low";
};
