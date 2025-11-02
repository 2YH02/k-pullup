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
          <div className={cn(
            "p-6 rounded-lg border-2 border-grey-light dark:border-grey-dark",
            "bg-gradient-to-br from-grey-light/30 to-transparent dark:from-grey-dark/30",
            "flex flex-col items-center text-center mt-6"
          )}>
            <div className="w-16 h-16 rounded-full bg-grey-light dark:bg-grey-dark flex items-center justify-center mb-4">
              <LocationIcon size={32} color="primary" />
            </div>
            <Text typography="t4" fontWeight="bold" display="block" className="mb-2">
              위치 정보를 찾을 수 없습니다
            </Text>
            <Text typography="t6" display="block" className="text-grey dark:text-grey mb-4">
              지도를 움직이거나<br />
              잠시 후 다시 시도해주세요
            </Text>
            <div className="w-full max-w-xs space-y-2 text-left mt-2">
              <div className="flex items-start gap-2">
                <Text typography="t6" className="text-primary dark:text-primary-dark font-bold">•</Text>
                <Text typography="t7" className="text-grey dark:text-grey">
                  브라우저의 위치 권한을 확인해주세요
                </Text>
              </div>
              <div className="flex items-start gap-2">
                <Text typography="t6" className="text-primary dark:text-primary-dark font-bold">•</Text>
                <Text typography="t7" className="text-grey dark:text-grey">
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
