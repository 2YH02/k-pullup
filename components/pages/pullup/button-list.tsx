"use client";

import IconButton from "@/components/common/icon-button";
import { type Marker } from "@/types/marker.types";
import Divider from "@common/divider";
import { useRouter } from "next/navigation";
import { BsPersonBoundingBox } from "react-icons/bs";
import BookmarkButton from "./bookmark-button";
import DeleteButton from "./delete-button";
import RoadviewButton from "./roadview-button";
import ShareButton from "./share-button";

interface ButtonListProps {
  marker: Marker;
}

const ButtonList = ({ marker }: ButtonListProps) => {
  const router = useRouter();

  return (
    <div className="flex border-t border-solid border-grey-light dark:border-grey-dark">
      <BookmarkButton
        markerId={marker.markerId}
        favorited={marker.favorited || false}
      />
      <Divider className="w-[1px] my-2" />
      <RoadviewButton lat={marker.latitude} lng={marker.longitude} />
      <Divider className="w-[1px] my-2" />
      <div className="relative flex-1">
        <IconButton
          icon={<BsPersonBoundingBox size={20} className="fill-primary" />}
          text="모먼트"
          className="w-full"
          onClick={() => router.push(`/pullup/${marker.markerId}/moment`)}
        />
      </div>
      <Divider className="w-[1px] my-2" />
      <ShareButton
        markerId={marker.markerId}
        lat={marker.latitude}
        lng={marker.longitude}
        address={marker.address || "주소 정보 없음"}
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
