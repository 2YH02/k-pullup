"use client";

import IconButton from "@common/icon-button";
import BookmarkIcon from "@icons/bookmark-icon";
import ConfigIcon from "@icons/config-icon";
import LocationPinIcon from "@icons/location-pin-icon";
import { useRouter } from "next/navigation";

const IconLinkList = () => {
  const router = useRouter();

  return (
    <div className="flex mo:flex-col justify-center items-center gap-2">
      <div className="flex gap-2">
        {/* <IconButton
          icon={<RankingIcon size={34} link />}
          text="랭킹"
          onClick={() => router.push("/challenge")}
        /> */}
        <IconButton
          icon={<BookmarkIcon size={34} link />}
          text="즐겨찾기"
          onClick={() => router.push("/mypage/bookmark")}
        />
        <IconButton
          icon={<LocationPinIcon size={34} link />}
          text="위치등록"
          onClick={() => router.push("/register")}
        />
        <IconButton
          icon={<ConfigIcon size={34} link />}
          text="설정"
          onClick={() => router.push("/mypage/config")}
        />
      </div>
      {/* <div className="flex gap-2">
        <IconButton
          icon={<ChatBubbleIcon size={34} link />}
          text="지역 채팅"
          onClick={() => router.push("/chat")}
        />
      </div> */}
    </div>
  );
};

export default IconLinkList;
