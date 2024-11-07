"use client";

import ListItem, { ListContents, ListRight } from "@common/list-item";
import { CopyPlusIcon } from "lucide-react";

const AddMomentButton = ({ onClick }: { onClick: VoidFunction }) => {
  return (
    <ListItem onClick={onClick}>
      <ListContents
        title="모먼트 추가"
        subTitle="오늘의 운동 기록을 남겨 보세요!"
      />
      <ListRight>
        <CopyPlusIcon size={20} />
      </ListRight>
    </ListItem>
  );
};

export default AddMomentButton;
