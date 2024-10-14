"use client";

import { type Device } from "@/app/mypage/page";
import Section from "@/components/common/section";
import Text from "@/components/common/text";
import SideMain from "@common/side-main";
import AroundSearch from "@pages/search/around-search";
import useGeolocationStore from "@store/useGeolocationStore";
import { useEffect, useState } from "react";

interface Props {
  deviceType: Device;
}

const AroundClient = ({ deviceType }: Props) => {
  const { curLocation } = useGeolocationStore();
  const { region, geoLocationError } = useGeolocationStore();

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

  //   TODO: 위치 정보 없을 때 gif 찾아서 넣기
  if (addr === null || addr === "위치 정보 없음") {
    return (
      <SideMain headerTitle="주변 검색" hasBackButton deviceType={deviceType}>
        <Section className="mt-10">
          <div className="text-center">
            <Text fontWeight="bold">위치 정보를 찾을 수 없습니다.</Text>
            <Text fontWeight="bold">
              지도를 움직이거나 잠시 후 다시 시도해주세요.
            </Text>
          </div>
        </Section>
      </SideMain>
    );
  }

  return (
    <SideMain headerTitle="주변 검색" hasBackButton deviceType={deviceType}>
      <Section className="mt-10">
        <div className="text-center">
          <Text fontWeight="bold">
            원하는 위치로 지도를 이동해 검색해 보세요!
          </Text>
        </div>
      </Section>
      <AroundSearch
        address={addr}
        lat={curLocation.lat.toString()}
        lng={curLocation.lng.toString()}
      />
    </SideMain>
  );
};

export default AroundClient;
