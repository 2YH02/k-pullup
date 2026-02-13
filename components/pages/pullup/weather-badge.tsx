"use client";

import getWeather, { type WeatherRes } from "@api/marker/get-weather";
import Badge from "@common/badge";
import Skeleton from "@common/skeleton";
import Image from "next/image";
import { useEffect, useState } from "react";

interface WeatherBadgeProps {
  lat: number;
  lng: number;
}

const WeatherBadge = ({ lat, lng }: WeatherBadgeProps) => {
  const [weather, setWeather] = useState<WeatherRes | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const weather = await getWeather(lat, lng);

      setWeather(weather);
      setLoading(false);
    };

    fetch();
  }, [lat, lng]);

  if (loading) {
    return <Skeleton className="w-28 h-7 rounded-3xl mr-2 mb-2" />;
  }

  if (!weather) return null;

  return (
    <Badge
      icon={
        <Image
          src={weather.iconImage}
          className="h-5 w-5"
          alt="weatherIcon"
          width={20}
          height={20}
        />
      }
      text={`${weather.temperature} °C`}
      className="flex items-center justify-center h-7 mr-2 mb-2 border-none shadow-full dark:shadow-[rgba(255,255,255,0.1)]"
      textStyle="leading-3"
    />
  );
};

export default WeatherBadge;
