"use client";

import updateDescription from "@api/marker/update-description";
import Button from "@common/button";
import Input from "@common/input";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import EditIcon from "@icons/edit-icon";
import LoadingIcon from "@icons/loading-icon";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DescriptionProps {
  description: string;
  markerId: number;
  isAdmin: boolean;
}

const Description = ({ description, markerId, isAdmin }: DescriptionProps) => {
  const router = useRouter();

  const [descriptionValue, setDescriptionValue] = useState(description);

  const descriptionInput = useInput(description);
  const [edit, setEdit] = useState(false);

  const [editError, setEditError] = useState("");
  const [loading, setLoading] = useState(false);

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
        <Input
          isInvalid={false}
          className="rounded-md h-8"
          value={descriptionInput.value}
          onChange={descriptionInput.onChange}
        />
        <div className="flex mt-2">
          <Button
            onClick={() => {
              setEdit(false);
              descriptionInput.resetValue();
            }}
            size="sm"
            variant="contrast"
            className="flex items-center justify-center w-14 h-8"
          >
            취소
          </Button>
          <Button
            onClick={handleClick}
            size="sm"
            className="flex items-center justify-center w-14 h-8 ml-2"
            disabled={description === descriptionInput.value || loading}
          >
            {loading ? (
              <LoadingIcon className="m-0 text-white" size="sm" />
            ) : (
              "변경"
            )}
          </Button>
        </div>
        <div className="h-4">
          <div className="text-red text-xs">{editError}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Text typography="t6" className="break-all">
        {descriptionValue || "작성된 설명이 없습니다."}
      </Text>
      {isAdmin && (
        <button onClick={() => setEdit(true)} className="block">
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
