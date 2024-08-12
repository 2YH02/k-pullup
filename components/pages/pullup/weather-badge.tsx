"use client";

import getWeather, { type WeatherRes } from "@api/marker/get-weather";
import Badge from "@common/badge";
import Skeleton from "@common/skeleton";
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
  }, []);

  if (loading) {
    return <Skeleton className="w-[92px] h-8 rounded-3xl" />;
  }

  if (!weather) return null;

  return (
    <Badge
      icon={<img src={weather.iconImage} className="w-6" />}
      text={`${weather.temperature} °C`}
      className="flex items-center justify-center h-8"
      textStyle="leading-3"
    />
  );
};

export default WeatherBadge;
