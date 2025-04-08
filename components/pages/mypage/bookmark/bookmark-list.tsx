"use client";

import deleteFavorite from "@api/favorite/delete-favorite";
import type { Favorite } from "@api/user/favorites";
import BottomSheet, { BottomSheetItem } from "@common/bottom-sheet";
import Text from "@common/text";
import { useToast } from "@hooks/useToast";
import PinIcon from "@icons/pin-icon";
import { useBottomSheetStore } from "@store/useBottomSheetStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsThreeDots, BsTrash } from "react-icons/bs";

interface BookmarkList {
  data: Favorite[];
}

const BookmarkList = ({ data }: BookmarkList) => {
  const router = useRouter();

  const [markers, setMarkers] = useState(data);

  const deleteMarkers = (id: number) => {
    setMarkers((prev) => {
      return prev.filter((marker) => marker.markerId !== id);
    });
  };

  return (
    <ul>
      {markers.map((marker) => {
        return (
          <ListItem
            key={marker.markerId}
            id={marker.markerId}
            title={marker.address || "주소 정보 없음"}
            subTitle={marker.description || "설명 없음"}
            leftIcon={<PinIcon size={28} />}
            onClick={() => {
              router.push(`/pullup/${marker.markerId}`);
            }}
            deleteMarker={deleteMarkers}
          />
        );
      })}
    </ul>
  );
};

const ListItem = ({
  id,
  title,
  subTitle,
  leftIcon,
  deleteMarker,
  onClick,
}: {
  id: number;
  title?: string;
  subTitle?: string;
  leftIcon?: React.ReactElement;
  deleteMarker: (id: number) => void;
  onClick?: VoidFunction;
}) => {
  const { show, hide } = useBottomSheetStore();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const res = await deleteFavorite(id);

    if (!res.ok) {
      toast({
        description: "잠시 후 다시 시도해주세요.",
      });
    } else deleteMarker(id);

    hide();
    setLoading(false);
  };

  return (
    <div className="px-1 py-2 active:bg-grey-light dark:active:bg-grey-dark flex border-b border-solid border-grey-light dark:border-grey-dark">
      <div className="max-w-[90%] grow">
        <button
          className="flex items-center w-full text-left duration-100"
          onClick={onClick}
        >
          {leftIcon && (
            <div className="shrink-0 w-[10%] flex justify-center items-center">
              {leftIcon}
            </div>
          )}
          <div className="shrink-0 max-w-[80%] flex flex-col">
            <Text className="text-sm font-bold break-words">{title}</Text>
            <Text className="text-xs text-grey dark:text-grey break-words">
              {subTitle}
            </Text>
          </div>
        </button>
      </div>
      <button
        className="shrink-0 w-[10%] flex justify-center items-center"
        onClick={(e) => {
          e.stopPropagation();
          show(`bookmark-${id}`);
        }}
      >
        <BsThreeDots className="text-grey" />
      </button>
      <BottomSheet title="저장한 장소" id={`bookmark-${id}`} className="pb-10">
        <BottomSheetItem
          icon={<BsTrash size={22} />}
          onClick={handleDelete}
          disabled={loading}
        >
          삭제
        </BottomSheetItem>
      </BottomSheet>
    </div>
  );
};

export default BookmarkList;
