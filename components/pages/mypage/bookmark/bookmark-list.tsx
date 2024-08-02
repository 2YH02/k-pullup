"use client";

import type { Favorite } from "@api/user/favorites";
import ListItem, { ListContents } from "@common/list-item";
import useMapControl from "@hooks/useMapControl";
import BookmarkIcon from "@icons/bookmark-icon";
import { useRouter } from "next/navigation";

interface BookmarkList {
  data: Favorite[];
}

const BookmarkList = ({ data }: BookmarkList) => {
  const router = useRouter();
  const { move } = useMapControl();

  return (
    <ul>
      {data.map((marker) => {
        return (
          <ListItem
            key={marker.markerId}
            icon={<BookmarkIcon size={25} />}
            onClick={() => {
              move({ lat: marker.latitude, lng: marker.longitude });
              router.push(`/pullup/${marker.markerId}`);
            }}
          >
            <ListContents
              title={marker.address}
              subTitle={marker.description}
            />
          </ListItem>
        );
      })}
    </ul>
  );
};

export default BookmarkList;
