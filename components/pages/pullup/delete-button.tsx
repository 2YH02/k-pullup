import IconButton from "@common/icon-button";
import { Trash2Icon } from "lucide-react";

const DeleteButton = () => {
  return (
    <IconButton
      icon={<Trash2Icon scale={25} className="stroke-primary" />}
      text="삭제"
      className="flex-1"
    />
  );
};

export default DeleteButton;
