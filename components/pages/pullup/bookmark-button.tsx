"use client";

import IconButton from "@common/icon-button";
import { useToast } from "@hooks/useToast";
import deleteFavorite from "@lib/api/favorite/delete-favorite";
import setFavorite from "@lib/api/favorite/set-favorite";
import useAlertStore from "@store/useAlertStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BookmarkButtonProps {
  markerId: number;
  favorited?: boolean;
}

const BookmarkButton = ({
  favorited = false,
  markerId,
}: BookmarkButtonProps) => {
  const router = useRouter();

  const { openAlert, closeAlert } = useAlertStore();
  const { toast } = useToast();

  const [isActive, setIsActive] = useState(favorited);

  const handleBookmark = async () => {
    let response;
    let description;
    if (isActive) {
      response = await deleteFavorite(markerId);
      description = "삭제가 완료되었습니다.";
    } else {
      response = await setFavorite(markerId);
      description = "저장이 완료되었습니다.";
    }

    if (!response.ok) {
      if (response.status === 401) {
        openAlert({
          title: "로그인이 필요합니다.",
          description: "로그인 페이지로 이동하시겠습니까?",
          onClick: () => {
            router.push(`/signin?returnUrl=/pullup/${markerId}`);
          },
          cancel: true,
        });
      } else {
        toast({
          description: "잠시 후 다시 시도해주세요.",
        });
        closeAlert();
        return;
      }
      return;
    }

    toast({
      description: description,
    });

    closeAlert();

    setIsActive((prev) => !prev);
  };

  const handleClick = () => {
    openAlert({
      title: isActive ? "북마크 삭제" : "북마크 추가",
      description: isActive
        ? "위치를 삭제하시겠습니까?"
        : "위치를 저장하시겠습니까?",
      onClickAsync: handleBookmark,
      cancel: true,
    });
  };
  return (
    <IconButton
      icon={<BookmarkIcon active={isActive} />}
      text="북마크"
      className="flex-1"
      onClick={handleClick}
    />
  );
};

const BookmarkIcon = ({ active }: { active: boolean }) => {
  const style = active ? "fill-primary" : "fill-none stroke-primary";
  return (
    <svg
      viewBox="0 0 48 48"
      height="25"
      width="25"
      strokeWidth={3}
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

export default BookmarkButton;
