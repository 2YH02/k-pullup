"use client";

import { type Marker } from "@/types/marker.types";
import Divider from "@common/divider";
import IconButton from "@common/icon-button";
import { useRouter } from "next/navigation";
import { BsPersonBoundingBox } from "react-icons/bs";
import BookmarkButton from "./bookmark-button";
import DeleteButton from "./delete-button";
import RoadviewButton from "./roadview-button";
import ShareButton from "./share-button";
import { useState } from "react";

interface ButtonListProps {
  marker: Marker;
}

const ButtonList = ({ marker }: ButtonListProps) => {
  const router = useRouter();

  const [favCount, setFavCount] = useState(marker.favCount || 0);

  const increaseFavCount = () => setFavCount((prev) => (prev += 1));
  const decreaseFavCount = () =>
    favCount > 0 && setFavCount((prev) => prev - 1);

  return (
    <div className="flex border-t border-solid border-grey-light dark:border-grey-dark">
      <div className="flex-1 relative">
        <BookmarkButton
          markerId={marker.markerId}
          favorited={marker.favorited || false}
          increaseFavCount={increaseFavCount}
          decreaseFavCount={decreaseFavCount}
        />
        {favCount > 0 && (
          <div className="absolute top-1 right-4 text-[10px] w-4 h-4 flex items-center justify-center bg-red rounded-full text-white">
            {favCount}
          </div>
        )}
      </div>
      <Divider className="w-px my-2" />
      <RoadviewButton lat={marker.latitude} lng={marker.longitude} />
      <Divider className="w-px my-2" />
      <div className="relative flex-1">
        <IconButton
          icon={<BsPersonBoundingBox size={20} className="fill-primary" />}
          text="모먼트"
          className="w-full"
          onClick={() => router.push(`/pullup/${marker.markerId}/moment`)}
        />
      </div>
      <Divider className="w-px my-2" />
      <ShareButton
        markerId={marker.markerId}
        lat={marker.latitude}
        lng={marker.longitude}
        address={marker.address || "주소 정보 없음"}
      />
      {marker.isChulbong && (
        <>
          <Divider className="w-px my-2" />
          <DeleteButton markerId={marker.markerId} />
        </>
      )}
    </div>
  );
};

export default ButtonList;
