"use client";

import { coordToAddress } from "@lib/kakao-geocoder";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

interface LocationWithAddressProps {
  lat: number;
  lng: number;
  className?: string;
}

/**
 * Display coordinates with human-readable address
 * Uses Kakao Geocoder with caching
 */
const LocationWithAddress = ({
  lat,
  lng,
  className = "",
}: LocationWithAddressProps) => {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const result = await coordToAddress(lat, lng);
        setAddress(result.shortAddress);
      } catch (error) {
        console.error("Geocoding error:", error);
        setAddress(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [lat, lng]);

  return (
    <div className={`flex items-center gap-2 text-xs text-gray-500 ${className}`}>
      <MapPin className="h-3 w-3 flex-shrink-0" />
      <span className="font-mono">
        {lat.toFixed(4)}, {lng.toFixed(4)}
      </span>
      {loading ? (
        <span className="text-gray-400 animate-pulse">...</span>
      ) : address ? (
        <span className="text-gray-600">({address})</span>
      ) : null}
    </div>
  );
};

export default LocationWithAddress;
