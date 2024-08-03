"use client";

import { Marker } from "@/types/marker.types";
import Divider from "@common/divider";
import BookmarkButton from "./bookmark-button";
import ChatButton from "./chat-button";
import DeleteButton from "./delete-button";
import RoadviewButton from "./roadview-button";
import ShareButton from "./share-button";

interface ButtonListProps {
  marker: Marker;
}

const ButtonList = ({ marker }: ButtonListProps) => {
  return (
    <div className="flex border-t border-solid border-grey-light dark:border-grey-dark">
      <BookmarkButton
        markerId={marker.markerId}
        favorited={marker.favorited || false}
      />
      <Divider className="w-[1px] my-2" />
      <ShareButton
        markerId={marker.markerId}
        lat={marker.latitude}
        lng={marker.longitude}
      />
      <Divider className="w-[1px] my-2" />
      <ChatButton markerId={marker.markerId} />
      <Divider className="w-[1px] my-2" />
      <RoadviewButton lat={marker.latitude} lng={marker.longitude} />
      {marker.isChulbong && (
        <>
          <Divider className="w-[1px] my-2" />
          <DeleteButton />
        </>
      )}
    </div>
  );
};

export default ButtonList;
