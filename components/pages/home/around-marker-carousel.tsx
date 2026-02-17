"use client";

import HorizontalScroll, {
  ScrollItem,
} from "@/components/common/horizontal-scroll";
import closeMarker, { type CloseMarker } from "@api/marker/close-marker";
import Button from "@common/button";
import Section, { SectionTitle } from "@common/section";
import Skeleton from "@common/skeleton";
import Text from "@common/text";
import LocationIcon from "@icons/location-icon";
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
        <SectionTitle title="내 주변 철봉" subTitle="현재 위치 기준 2km" />
        <div className="flex gap-3">
          {[0, 1].map((key) => (
            <div
              key={key}
              className="shrink-0 w-64 rounded-2xl border border-primary/10 bg-side-main p-2 dark:border-grey-dark dark:bg-black/35"
            >
              <Skeleton className="h-36 w-full rounded-xl" />
              <Skeleton className="mt-3 h-4 w-3/4 rounded-md" />
              <Skeleton className="mt-2 h-3 w-1/3 rounded-md" />
            </div>
          ))}
        </div>
      </Section>
    );
  }

  if (geolocationError) {
    return (
      <Section>
        <SectionTitle title="내 주변 철봉" subTitle="현재 위치 기준 2km" />
        <div className="rounded-2xl border border-primary/12 bg-side-main p-4 dark:border-grey-dark dark:bg-black/35">
          <div className="mb-3">
            <Text display="block" typography="t6" className="text-text-on-surface">
              현재 위치 정보를 확인할 수 없습니다.
            </Text>
            <Text
              display="block"
              typography="t6"
              className="text-text-on-surface-muted dark:text-grey"
            >
              위치 접근을 허용한 뒤 다시 시도해 주세요.
            </Text>
          </div>
          <Button
            onClick={() => {
              router.push("/search/around");
            }}
            size="sm"
            className="w-28 rounded-full"
          >
            주변 검색
          </Button>
        </div>
      </Section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Section>
        <SectionTitle title="내 주변 철봉" subTitle="현재 위치 기준 2km" />
        <div className="rounded-2xl border border-primary/12 bg-side-main p-4 dark:border-grey-dark dark:bg-black/35">
          <div className="mb-3">
            <Text display="block" typography="t6">
              현재 위치 주변 2,000m 내에 철봉이 없습니다.
            </Text>
            <Text
              display="block"
              typography="t6"
              className="text-text-on-surface-muted dark:text-grey"
            >
              검색 반경을 넓혀 다른 위치를 확인해 보세요.
            </Text>
          </div>
          <Button
            onClick={() => {
              router.push("/search/around");
            }}
            size="sm"
            className="w-28 rounded-full"
          >
            주변 검색
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <SectionTitle title="내 주변 철봉" subTitle="현재 위치 기준 2km" />
      <HorizontalScroll className="pb-1">
        {data.map((marker, index) => (
          <ScrollItem className="p-0 w-64" key={`${marker.markerId}-${index}`}>
            <button
              className="group w-full text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-[0.99] transition-transform duration-150"
              onClick={() => {
                router.push(`/pullup/${marker.markerId}`);
              }}
              type="button"
            >
              <div className="relative overflow-hidden rounded-2xl border border-primary/12 bg-side-main transition-colors duration-300 group-hover:border-primary/35 group-hover:bg-white/45 dark:border-grey-dark dark:bg-black/35 dark:group-hover:border-primary-light/35 dark:group-hover:bg-black/30 group-active:border-primary/45 group-active:bg-white/55 dark:group-active:bg-black/35">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/40 group-active:bg-primary/50" />
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={marker.thumbnail ? marker.thumbnail : "/metaimg.webp"}
                    alt="주변 철봉 이미지"
                    width={640}
                    height={420}
                    sizes="(max-width: 484px) 70vw, 256px"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] group-active:scale-[1.02]"
                    draggable={false}
                  />
                  <div className="absolute right-2 top-2 rounded-full bg-black/45 px-2 py-1 text-[11px] font-semibold text-white transition-colors duration-300 group-hover:bg-black/60">
                    {Math.round(marker.distance)}m
                  </div>
                </div>
                <div className="p-3">
                  <Text
                    className="truncate text-text-on-surface"
                    typography="t5"
                    fontWeight="bold"
                  >
                    {splitAddress(marker.address)}
                  </Text>
                  <div className="mt-1 flex items-center gap-1">
                    <LocationIcon size={14} className="text-text-on-surface-muted dark:text-grey" />
                    <Text
                      className="truncate text-text-on-surface-muted dark:text-grey"
                      textAlign="left"
                      typography="t7"
                    >
                      내 위치 기준
                    </Text>
                  </div>
                </div>
              </div>
            </button>
          </ScrollItem>
        ))}
      </HorizontalScroll>
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
