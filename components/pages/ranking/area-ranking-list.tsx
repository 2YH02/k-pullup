"use client";

import areaRanking from "@api/marker/area-ranking";
import { RankingInfo } from "@api/marker/marker-ranking";
import Badge from "@common/badge";
import { Carousel, CarouselContent, CarouselItem } from "@common/carousel";
import Text from "@common/text";
import { CITIES, CITIES_BADGE_TITLE } from "@constant/index";
import CheckedIcon from "@icons/checked-icon";
import LoadingIcon from "@icons/loading-icon";
import useGeolocationStore from "@store/useGeolocationStore";
import { useCallback, useEffect, useState } from "react";
import RankingItem from "./ranking-item";

type BadgeTitles = typeof CITIES_BADGE_TITLE;
type BadgeTitle = BadgeTitles[number];

const AreaRankingList = () => {
  const [data, setData] = useState<RankingInfo[] | null>(null);
  const [loading, setLoading] = useState(false);

  const [curBadge, setCurBadge] = useState<BadgeTitle>("내 주변");

  const { myLocation } = useGeolocationStore();

  const getAreaRankingData = useCallback(async (lat: number, lng: number) => {
    setLoading(true);

    const data = await areaRanking(lat, lng);

    setData(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!myLocation) return;
    const fetchData = async () => {
      setLoading(true);
      const data = await areaRanking(myLocation.lat, myLocation.lng);

      setData(data);
      setLoading(false);
    };
    fetchData();
  }, [myLocation]);

  const changeCurBadge = async (city: BadgeTitle) => {
    let lat;
    let lng;
    if (city === "내 주변") {
      if (!myLocation) return;
      lat = myLocation.lat;
      lng = myLocation.lng;
    } else {
      const curCity = CITIES.find((item) => item.name === city);
      if (!curCity) return;
      lat = curCity.lat;
      lng = curCity.lng;
    }

    await getAreaRankingData(lat, lng);

    setCurBadge(city);
  };

  if (loading) {
    return (
      <div>
        <BadgeCarousel
          data={CITIES_BADGE_TITLE}
          onClick={changeCurBadge}
          curState={curBadge}
        />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mo:mt-20">
          <LoadingIcon />
        </div>
      </div>
    );
  }

  if (data?.length === 0) {
    return (
      <div>
        <BadgeCarousel
          data={CITIES_BADGE_TITLE}
          onClick={changeCurBadge}
          curState={curBadge}
        />
        <div className="p-4">
          <Text textAlign="center" display="block">
            {curBadge}에 순위에 등록된 위치가 없습니다.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="px-2">
        <BadgeCarousel
          data={CITIES_BADGE_TITLE}
          onClick={changeCurBadge}
          curState={curBadge}
        />
      </div>
      <ul>
        {data?.map((item, index) => {
          return (
            <RankingItem
              key={item.markerId}
              title={item.address}
              ranking={index + 1}
            />
          );
        })}
      </ul>
    </div>
  );
};

const BadgeCarousel = ({
  data,
  onClick,
  curState,
}: {
  data: BadgeTitles;
  onClick: (citie: string) => void;
  curState?: string;
}) => {
  return (
    <Carousel opts={{ dragFree: true }}>
      <CarouselContent className="-ml-1 p-1">
        {data.map((item) => (
          <CarouselItem key={item} className="basis-auto pl-0 pr-2">
            <Badge
              text={item}
              isButton
              onClick={() => onClick(item)}
              icon={curState === item && <CheckedIcon size={20} />}
              className={`${
                curState === item
                  ? "border-primary-dark"
                  : "border-primary-dark border-opacity-60"
              }`}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default AreaRankingList;
