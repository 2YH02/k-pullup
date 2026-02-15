"use client";

import deleteFavorite from "@api/favorite/delete-favorite";
import type { Favorite } from "@api/user/favorites";
import BottomSheet, { BottomSheetItem } from "@common/bottom-sheet";
import Text from "@common/text";
import { useToast } from "@hooks/useToast";
import PinIcon from "@icons/pin-icon";
import { useBottomSheetStore } from "@store/useBottomSheetStore";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <section className="px-6 pb-6">
      <ul className="space-y-2">
        {markers.map((marker) => {
          return (
            <ListItem
              key={marker.markerId}
              id={marker.markerId}
              title={marker.address || "주소 정보 없음"}
              subTitle={marker.description || "설명 없음"}
              leftIcon={<PinIcon size={26} />}
              onClick={() => {
                router.push(`/pullup/${marker.markerId}`);
              }}
              deleteMarker={deleteMarkers}
            />
          );
        })}
      </ul>
    </section>
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
    <li className="group flex items-center gap-2 rounded-xl border border-primary/10 bg-surface/80 px-3 py-2.5 transition-[transform,background-color,border-color] duration-180 ease-out web:hover:border-primary/20 web:hover:bg-white/70 active:scale-[0.995] dark:border-grey-dark dark:bg-black dark:web:hover:bg-black-light">
      <div className="min-w-0 grow">
        <button
          className="flex w-full items-center gap-3 text-left focus-visible:outline-none"
          onClick={onClick}
        >
          {leftIcon && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 dark:bg-primary-dark/20">
              {leftIcon}
            </div>
          )}
          <div className="min-w-0 max-w-[85%]">
            <Text
              typography="t6"
              className="block break-words font-semibold text-primary dark:text-primary-light"
            >
              {title}
            </Text>
            <Text
              typography="t7"
              className="mt-0.5 block break-words text-grey-dark dark:text-grey"
            >
              {subTitle}
            </Text>
          </div>
        </button>
      </div>
      <button
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-grey-dark transition-colors duration-150 web:hover:bg-primary/10 web:hover:text-primary active:scale-[0.98] dark:text-grey dark:web:hover:bg-primary-dark/20 dark:web:hover:text-primary-light"
        aria-label="즐겨찾기 옵션"
        onClick={(e) => {
          e.stopPropagation();
          show(`bookmark-${id}`);
        }}
      >
        <MoreHorizontal size={18} />
      </button>
      <BottomSheet title="저장한 장소" id={`bookmark-${id}`} className="pb-10">
        <BottomSheetItem
          icon={<Trash2 size={20} />}
          onClick={handleDelete}
          disabled={loading}
        >
          삭제
        </BottomSheetItem>
      </BottomSheet>
    </li>
  );
};

export default BookmarkList;
