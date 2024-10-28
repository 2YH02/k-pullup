"use client";

import { type Marker } from "@/types/marker.types";
import convertWgs from "@api/marker/convert-wgs";
import Divider from "@common/divider";
import IconButton from "@common/icon-button";
import useGps from "@hooks/useGps";
import { ArrowDownToDot } from "lucide-react";
import BookmarkButton from "./bookmark-button";
import DeleteButton from "./delete-button";
import RoadviewButton from "./roadview-button";
import ShareButton from "./share-button";

interface ButtonListProps {
  marker: Marker;
}

const ButtonList = ({ marker }: ButtonListProps) => {
  const { handleGps } = useGps();
  const openLocation = async () => {
    const myLocate = handleGps();
    if (myLocate) {
      const sp = await convertWgs(myLocate.lat, myLocate.lng);
      const dst = await convertWgs(marker.latitude, marker.longitude);

      if (sp && dst) {
        let url = `https://map.kakao.com/?map_type=TYPE_MAP&target=walk&rt=${sp.X},${sp.Y},${dst.X},${dst.Y}&rt1=내 위치&rt2=${marker.address}`;

        // kakaomap://route?sp=37.53723,127.00551&ep=37.49795,127.027637&by=FOOT
        window.open(url, "_blank");
      }
    }
  };

  return (
    <div className="flex border-t border-solid border-grey-light dark:border-grey-dark">
      <BookmarkButton
        markerId={marker.markerId}
        favorited={marker.favorited || false}
      />
      <Divider className="w-[1px] my-2" />
      <RoadviewButton lat={marker.latitude} lng={marker.longitude} />
      <Divider className="w-[1px] my-2" />
      <IconButton
        icon={<ArrowDownToDot size={26} color="#f9b4ab" />}
        text="길찾기"
        className="flex-1"
        onClick={openLocation}
      />
      <Divider className="w-[1px] my-2" />
      <ShareButton
        markerId={marker.markerId}
        lat={marker.latitude}
        lng={marker.longitude}
      />
      {marker.isChulbong && (
        <>
          <Divider className="w-[1px] my-2" />
          <DeleteButton markerId={marker.markerId} />
        </>
      )}
    </div>
  );
};

export default ButtonList;
