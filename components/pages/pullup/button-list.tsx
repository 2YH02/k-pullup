"use client";

import Divider from "@common/divider";
import Text from "@common/text";
import ChatBubbleIcon from "@icons/chat-bubble-icon";
import PinIcon from "@icons/pin-icon";
import { ShareIcon, Trash2Icon } from "lucide-react";
import BookmarkButton from "./bookmark-button";

interface ButtonListProps {
  isChulbong?: boolean;
  markerId: number;
  favorited: boolean;
}

const ButtonList = ({
  isChulbong = false,
  markerId,
  favorited,
}: ButtonListProps) => {
  return (
    <div className="flex border-t border-solid border-grey-light dark:border-grey-dark">
      <BookmarkButton
        className="p-1 pt-3 flex-1"
        markerId={markerId}
        favorited={favorited}
      />
      <Divider className="w-[1px] my-2" />
      <button className="p-1 pt-3 flex flex-col items-center justify-center flex-1">
        <ShareIcon size={25} className="stroke-primary" />
        <Text typography="t6" className="mt-1">
          공유
        </Text>
      </button>
      <Divider className="w-[1px] my-2" />
      <button className="p-1 pt-3 flex flex-col items-center justify-center flex-1">
        <ChatBubbleIcon size={25} className="fill-primary dark:fill-primary" />
        <Text typography="t6" className="mt-1">
          채팅
        </Text>
      </button>
      <Divider className="w-[1px] my-2" />
      <button className="p-1 pt-3 flex flex-col items-center justify-center flex-1">
        <PinIcon size={26} />
        <Text typography="t6" className="mt-1">
          거리뷰
        </Text>
      </button>
      {isChulbong && (
        <>
          <Divider className="w-[1px] my-2" />
          <button className="p-1 pt-3 flex flex-col items-center justify-center flex-1">
            <Trash2Icon scale={25} className="stroke-primary" />
            <Text typography="t6" className="mt-1">
              삭제
            </Text>
          </button>
        </>
      )}
    </div>
  );
};

const BookmarkIcon = ({ active }: { active: boolean }) => {
  const style = active ? "fill-primary" : "fill-none stroke-black-light";
  return (
    <svg
      viewBox="0 0 48 48"
      height="25"
      width="25"
      strokeWidth={2}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M34 6H14c-2.21 0-3.98 1.79-3.98 4L10 42l14-6 14 6V10c0-2.21-1.79-4-4-4z"
        className={style}
      />
      <path d="M0 0h48v48H0z" fill="none" />
    </svg>
  );
};

export default ButtonList;
