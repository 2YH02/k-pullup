"use client";

import {
  calculateDistance,
  formatDistance,
} from "@lib/admin-utils";
import { ArrowRight, MapPin, MoveRight } from "lucide-react";

interface LocationComparisonProps {
  oldLat: number;
  oldLng: number;
  newLat: number;
  newLng: number;
  className?: string;
}

/**
 * Side-by-side location comparison with distance calculation
 */
const LocationComparison = ({
  oldLat,
  oldLng,
  newLat,
  newLng,
  className,
}: LocationComparisonProps) => {
  const distance = calculateDistance(oldLat, oldLng, newLat, newLng);
  const formattedDistance = formatDistance(distance);
  const hasMoved = distance > 0.5; // Threshold: 0.5 meters

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-4 w-4 text-blue" />
        <span className="text-sm font-medium text-gray-700">위치 변경</span>
        {hasMoved && (
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold"
            style={{ backgroundColor: '#fff7ed', color: '#ea580c', border: '1px solid #fdba74' }}
          >
            {formattedDistance} 이동
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        {/* Old Location */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="text-xs font-medium text-gray-500 mb-1">현재 위치</div>
          <div className="font-mono text-sm text-gray-900">
            {oldLat.toFixed(6)}, {oldLng.toFixed(6)}
          </div>
          <a
            href={`https://map.kakao.com/link/map/${oldLat},${oldLng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue hover:underline mt-1 inline-block"
          >
            지도에서 보기 →
          </a>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          {hasMoved ? (
            <MoveRight className="h-6 w-6 text-orange-500" />
          ) : (
            <ArrowRight className="h-6 w-6 text-gray-300" />
          )}
        </div>

        {/* New Location */}
        <div
          className={`rounded-lg p-4 border ${
            hasMoved
              ? "bg-blue-50 border-blue-300"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div
            className={`text-xs font-medium mb-1 ${
              hasMoved ? "text-blue-700" : "text-gray-500"
            }`}
          >
            {hasMoved ? "새 위치" : "위치 변경 없음"}
          </div>
          <div
            className={`font-mono text-sm ${
              hasMoved ? "text-blue-900" : "text-gray-900"
            }`}
          >
            {newLat.toFixed(6)}, {newLng.toFixed(6)}
          </div>
          <a
            href={`https://map.kakao.com/link/map/${newLat},${newLng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue hover:underline mt-1 inline-block"
          >
            지도에서 보기 →
          </a>
        </div>
      </div>

      {/* Distance Info */}
      {hasMoved && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
          <MoveRight className="h-4 w-4 text-orange-600" />
          <span>
            위치가 <strong className="text-orange-700">{formattedDistance}</strong>{" "}
            이동했습니다
          </span>
        </div>
      )}
    </div>
  );
};

export default LocationComparison;
