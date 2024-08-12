"use client";

import closeMarker, { type CloseMarker } from "@api/marker/close-marker";
import Button from "@common/button";
import { Carousel, CarouselContent, CarouselItem } from "@common/carousel";
import Section, { SectionTitle } from "@common/section";
import Skeleton from "@common/skeleton";
import Text from "@common/text";
import useGeolocationStore from "@store/useGeolocationStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AroundMarkerCarousel = () => {
  const router = useRouter();

  const { myLocation } = useGeolocationStore();

  const [data, setData] = useState<CloseMarker[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [geolocationError, setGeolocationError] = useState(false);

  useEffect(() => {
    if (!myLocation) {
      setLoading(false);
      setGeolocationError(true);
      return;
    }

    setGeolocationError(false);

    const fetchMarker = async () => {
      const data = await closeMarker({
        lat: myLocation.lat,
        lng: myLocation.lng,
        distance: 2000,
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
        <div className="flex h-[160px]">
          <div className="flex flex-col">
            <Skeleton className="mr-2 w-32 h-32 p-1 mb-2" />
            <Skeleton className="mr-2 w-20 h-4 p-1 mb-2" />
          </div>
          <div className="flex flex-col">
            <Skeleton className="mr-2 w-32 h-32 p-1 mb-2" />
            <Skeleton className="mr-2 w-20 h-4 p-1 mb-2" />
          </div>
        </div>
      </Section>
    );
  }

  if (geolocationError) {
    return (
      <Section>
        <SectionTitle title="내 주변 철봉" />
        <div className="flex flex-col justify-around h-[160px]">
          <div className="mb-2">
            <Text display="block">
              현재 위치 정보가 제공되고 있지 않습니다.
            </Text>
            <Text display="block">위치 정보 제공에 동의해주세요.</Text>
          </div>
          <Button
            onClick={() => {
              router.push("/search");
            }}
            size="sm"
            className="w-32"
          >
            주변 검색
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <SectionTitle title="내 주변 철봉" />
      <Carousel opts={{ dragFree: true }}>
        {!data ? (
          <div className="flex flex-col justify-around h-[160px]">
            <div className="mb-2">
              <Text display="block">
                현재 위치 주변에 2,000m 내에 철봉이 없습니다.
              </Text>
              <Text display="block">더 넓은 범위에서 찾아보세요!</Text>
            </div>
            <Button
              onClick={() => {
                router.push("/search");
              }}
              size="sm"
              className="w-32"
            >
              주변 검색
            </Button>
          </div>
        ) : (
          <>
            <CarouselContent className="-ml-1 gap-3 w-32 h-[160px] p-1">
              {data.map((marker) => (
                <CarouselItem className="p-0" key={marker.markerId}>
                  <button
                    className="w-full h-full flex flex-col justify-between"
                    onClick={() => {
                      router.push(`/pullup/${marker.markerId}`);
                    }}
                  >
                    <div className="">
                      <Image
                        src={"/metaimg.webp"}
                        alt={"상세"}
                        width={128}
                        height={128}
                        className="shadow-md rounded-md overflow-hidden"
                      />
                    </div>
                    <div className="flex items-center w-[120px] overflow-hidden whitespace-nowrap">
                      <Text className="truncate" typography="t6">
                        {splitAddress(marker.address)}
                      </Text>
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

const splitAddress = (address?: string) => {
  if (!address) return "주소 정보 제공 안됨";
  const addressArr = address.split(" ");
  const newArr = addressArr.filter((_, index) => {
    return index !== 0 && index !== 1;
  });

  const newAddress = newArr.join(" ");

  return newAddress;
};

export default AroundMarkerCarousel;
