"use client";

import useMapStore from "@/store/useMapStore";
import updateDescription from "@api/marker/update-description";
import Button from "@common/button";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import EditIcon from "@icons/edit-icon";
import LoadingIcon from "@icons/loading-icon";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DescriptionProps {
  description: string;
  markerId: number;
  isAdmin: boolean;
}

const Description = ({ description, markerId, isAdmin }: DescriptionProps) => {
  const router = useRouter();

  const { setSelectedId } = useMapStore();

  const [descriptionValue, setDescriptionValue] = useState(description);

  const descriptionInput = useInput(description);
  const [edit, setEdit] = useState(false);

  const [editError, setEditError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => setSelectedId(null);
  }, [setSelectedId]);

  const handleClick = async () => {
    if (description === descriptionInput.value) return;

    setLoading(true);
    const data = await updateDescription(descriptionInput.value, markerId);
    if (data.error || data.message) {
      if (data.error === "Description contains profanity") {
        setEditError("설명에 비속어를 포함할 수 없습니다.");
      } else {
        setEditError("잠시 후 다시 시도해주세요.");
      }
      setLoading(false);
      return;
    }
    setDescriptionValue(descriptionInput.value);
    setLoading(false);
    setEdit(false);
    router.refresh();
  };

  if (edit) {
    return (
      <div className="mt-2">
        <textarea
          className="w-full resize-none rounded-lg border border-primary/45 bg-search-input-bg/45 p-2.5 text-black transition-colors duration-150 focus:outline-hidden focus:ring-2 focus:ring-primary/35 dark:border-grey-dark dark:bg-black/35 dark:text-grey-light"
          maxLength={40}
          rows={4}
          placeholder="해당 위치에 대한 설명을 40자 이내로 작성해주세요."
          value={descriptionInput.value}
          onChange={descriptionInput.onChange}
        />
        <div className="mt-2 flex items-center">
          <Button
            onClick={() => {
              setEdit(false);
              descriptionInput.resetValue();
            }}
            size="sm"
            variant="contrast"
            className="flex h-8 w-14 items-center justify-center"
          >
            취소
          </Button>
          <Button
            onClick={handleClick}
            size="sm"
            className="ml-2 flex h-8 w-14 items-center justify-center"
            disabled={description === descriptionInput.value || loading}
          >
            {loading ? (
              <LoadingIcon className="m-0 text-white" size="sm" />
            ) : (
              "변경"
            )}
          </Button>
        </div>
        <div className="h-4 pt-1">
          <div className="text-xs text-red">{editError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-1 flex items-start">
      <Text
        typography="t6"
        fontWeight="bold"
        className="mr-2 break-all text-text-on-surface dark:text-grey-light"
      >
        {descriptionValue || "작성된 설명이 없습니다."}
      </Text>
      {isAdmin && (
        <button
          onClick={() => setEdit(true)}
          className="rounded-sm p-1 transition-colors duration-150 active:bg-black/5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/35 dark:active:bg-white/10"
          aria-label="설명 수정"
        >
          <EditIcon
            size={14}
            className="stroke-grey-dark dark:stroke-grey-light dark:fill-black"
          />
        </button>
      )}
    </div>
  );
};

export default Description;
