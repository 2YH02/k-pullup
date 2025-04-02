"use client";

import IconButton from "@common/icon-button";
import { useToast } from "@hooks/useToast";
import deleteFavorite from "@lib/api/favorite/delete-favorite";
import setFavorite from "@lib/api/favorite/set-favorite";
import useAlertStore from "@store/useAlertStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

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
      } else if (response.status === 403) {
        openAlert({
          title: "개수 초과",
          description: "북마크는 최대 10개까지 가능합니다.",
          onClick: () => {},
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
      icon={
        isActive ? (
          <BsBookmarkFill size={20} className="fill-primary" />
        ) : (
          <BsBookmark size={20} className="fill-primary" />
        )
      }
      text="북마크"
      className="flex-1"
      onClick={handleClick}
    />
  );
};

export default BookmarkButton;
