"use client";

import Badge from "@common/badge";
import LocationIcon from "@icons/location-icon";
import useGeolocationStore from "@store/useGeolocationStore";

const LocationBadge = () => {
  // TODO: 주소 가져오기 이후 훅 분리 필요 (search/around-client 에서 사용 중)
  const { region, geoLocationError } = useGeolocationStore();

  if (!region || geoLocationError) {
    return (
      <Badge
        text="위치 정보 없음"
        icon={<LocationIcon size={20} className="fill-primary-dark" />}
      />
    );
  }

  const { region_2depth_name, region_3depth_name, address_name } = region;
  const title =
    region_2depth_name !== "" || region_3depth_name !== ""
      ? `${region_2depth_name} ${region_3depth_name}`
      : address_name;

  return (
    <Badge
      text={title as string}
      icon={<LocationIcon size={20} className="fill-primary-dark" />}
      className="pl-[5px]"
    />
  );
};

export default LocationBadge;
