"use client";

import IconButton from "@common/icon-button";
import { useToast } from "@hooks/useToast";
import deleteFavorite from "@lib/api/favorite/delete-favorite";
import setFavorite from "@lib/api/favorite/set-favorite";
import useAlertStore from "@store/useAlertStore";
import { useState } from "react";
// TODO: 401에러 헨들링 추가
// TODO: 이후 공통 컴포넌트로 이동 고려 (상세 페이지 다른 버튼들도 똑같이)
// TODO: 자식 요소 children으로 받을지 고려

interface BookmarkButtonProps {
  markerId: number;
  favorited?: boolean;
}

const BookmarkButton = ({
  favorited = false,
  markerId,
}: BookmarkButtonProps) => {
  const [isActive, setIsActive] = useState(favorited);
  const { openAlert, closeAlert } = useAlertStore();
  const { toast } = useToast();

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
      toast({
        description: "잠시 후 다시 시도해주세요.",
      });
      closeAlert();
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
      title: "북마크 추가",
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
