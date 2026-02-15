"use client";

import { type Device } from "@/app/mypage/page";
import Section from "@/components/common/section";
import Text from "@/components/common/text";
import SideMain from "@common/side-main";
import AroundSearch from "@pages/search/around-search";
import useGeolocationStore from "@store/useGeolocationStore";
import { useEffect, useState } from "react";
import LocationIcon from "@icons/location-icon";
import cn from "@/lib/cn";

interface Props {
  deviceType: Device;
}

const AroundClient = ({ deviceType }: Props) => {
  const { region, geoLocationError, curLocation } = useGeolocationStore();

  const [addr, setAddr] = useState<string | null>(null);

  useEffect(() => {
    if (!region || geoLocationError) {
      setAddr("위치 정보 없음");
    } else {
      const { region_2depth_name, region_3depth_name, address_name } = region;
      const title =
        region_2depth_name !== "" || region_3depth_name !== ""
          ? `${region_2depth_name} ${region_3depth_name}`
          : address_name;

      if (title) {
        setAddr(title);
      }
    }
  }, [region, geoLocationError]);

  if (addr === null || addr === "위치 정보 없음") {
    return (
      <SideMain headerTitle="주변 검색" hasBackButton deviceType={deviceType}>
        <Section>
          {/* Error State Card */}
          <div
            className={cn(
              "relative isolate overflow-hidden",
              "p-6 rounded-2xl border border-white/70 dark:border-white/10",
              "bg-search-input-bg/65 dark:bg-black/32 backdrop-blur-md",
              "shadow-[0_10px_24px_rgba(64,64,56,0.08)] dark:shadow-[0_10px_24px_rgba(0,0,0,0.3)]",
              "flex flex-col items-center text-center mt-6"
            )}
          >
            <div
              aria-hidden
              className={cn(
                "absolute inset-0 pointer-events-none",
                "bg-linear-to-br from-white/35 via-transparent to-primary/10",
                "dark:from-white/8 dark:to-primary-dark/20"
              )}
            />
            <div className="relative w-16 h-16 rounded-full border border-white/45 dark:border-white/10 bg-white/35 dark:bg-white/6 flex items-center justify-center mb-4">
              <LocationIcon size={32} color="primary" />
            </div>
            <Text
              typography="t4"
              fontWeight="bold"
              display="block"
              className="relative mb-2 text-text-on-surface dark:text-grey-light"
            >
              위치 정보를 찾을 수 없습니다
            </Text>
            <Text
              typography="t6"
              display="block"
              className="relative text-text-on-surface-muted dark:text-grey mb-4"
            >
              지도를 움직이거나
              <br />
              잠시 후 다시 시도해주세요
            </Text>
            <div className="relative w-full max-w-xs space-y-2 text-left mt-2">
              <div className="flex items-start gap-2.5 rounded-xl p-2.5 bg-white/45 dark:bg-white/5">
                <Text
                  typography="t6"
                  className={cn(
                    "shrink-0 flex h-5 w-5 items-center justify-center rounded-full",
                    "bg-primary/12 dark:bg-primary-light/20",
                    "text-primary dark:text-primary-light font-bold"
                  )}
                >
                  1
                </Text>
                <Text typography="t7" className="text-text-on-surface-muted dark:text-grey">
                  브라우저의 위치 권한을 확인해주세요
                </Text>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl p-2.5 bg-white/45 dark:bg-white/5">
                <Text
                  typography="t6"
                  className={cn(
                    "shrink-0 flex h-5 w-5 items-center justify-center rounded-full",
                    "bg-primary/12 dark:bg-primary-light/20",
                    "text-primary dark:text-primary-light font-bold"
                  )}
                >
                  2
                </Text>
                <Text typography="t7" className="text-text-on-surface-muted dark:text-grey">
                  지도를 원하는 위치로 이동한 후 다시 시도해주세요
                </Text>
              </div>
            </div>
          </div>
        </Section>
      </SideMain>
    );
  }

  return (
    <SideMain headerTitle="주변 검색" hasBackButton deviceType={deviceType}>
      <AroundSearch
        address={addr}
        lat={curLocation.lat.toString()}
        lng={curLocation.lng.toString()}
      />
    </SideMain>
  );
};

export default AroundClient;
