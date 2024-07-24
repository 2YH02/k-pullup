"use client";

import closeMarker, { type CloseMarker } from "@api/marker/close-marker";
import Button from "@common/button";
import { Carousel, CarouselContent, CarouselItem } from "@common/carousel";
import Section, { SectionTitle } from "@common/section";
import Skeleton from "@common/skeleton";
import Text from "@common/text";
import useGeolocationStore from "@store/useGeolocationStore";
import Image from "next/image";
import { useEffect, useState } from "react";
// TODO: 슬라이드 아이템 hover 시 툴팁으로 주소 표시

const AroundMarkerCarousel = () => {
  const { myLocation } = useGeolocationStore();

  const [data, setData] = useState<CloseMarker[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!myLocation) return;

    const fetchMarker = async () => {
      const data = await closeMarker({
        lat: myLocation.lat,
        lng: myLocation.lng,
        distance: 1000,
        pageParam: 1,
      });

      setData(data.markers);
      setLoading(false);
    };

    fetchMarker();
  }, [myLocation]);

  if (loading) {
    return (
      <Section>
        <SectionTitle title="내 주변 철봉" />
        <div className="flex h-36">
          <div className="flex flex-col">
            <Skeleton className="mr-2 w-28 h-28 p-1 mb-2" />
            <Skeleton className="mr-2 w-20 h-4 p-1 mb-2" />
          </div>
          <div className="flex flex-col">
            <Skeleton className="mr-2 w-28 h-28 p-1 mb-2" />
            <Skeleton className="mr-2 w-20 h-4 p-1 mb-2" />
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <SectionTitle title="내 주변 철봉" />
      <Carousel opts={{ dragFree: true }}>
        {!data ? (
          <div className="flex flex-col justify-center h-28">
            <div className="mb-2">
              <Text display="block">
                현재 위치 주변에 1000m 내에 철봉이 없습니다.
              </Text>
              <Text display="block">더 넓은 범위에서 찾아보세요!</Text>
            </div>
            <Button onClick={() => {}} size="sm" className="w-32">
              주변 검색
            </Button>
          </div>
        ) : (
          <>
            <CarouselContent className="-ml-1 gap-3 w-28 h-36 p-1">
              {data.map((marker) => (
                <CarouselItem
                  className="p-0 rounded-sm overflow-hidden"
                  key={marker.markerId}
                >
                  <button className="w-full h-full flex flex-col justify-between">
                    <div className="">
                      <Image
                        src={"/metaimg.webp"}
                        alt={`임시`}
                        width={112}
                        height={112}
                        className="shadow-md"
                      />
                    </div>
                    <div className="flex items-center w-24 overflow-hidden whitespace-nowrap">
                      <Text className="truncate">{marker.address}</Text>
                    </div>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </>
        )}
      </Carousel>
    </Section>
  );
};

export default AroundMarkerCarousel;
