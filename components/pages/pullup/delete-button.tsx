import IconButton from "@common/icon-button";
import useMarkerControl from "@hooks/useMarkerControl";
import { Trash2Icon } from "lucide-react";

interface DeleteButtonProps {
  markerId: number;
}

const DeleteButton = ({ markerId }: DeleteButtonProps) => {
  const { deleteMarker } = useMarkerControl();

  const handleDelete = () => {
    deleteMarker(markerId);
  };
  return (
    <IconButton
      icon={<Trash2Icon scale={25} className="stroke-primary" />}
      text="삭제"
      className="flex-1"
      onClick={handleDelete}
    />
  );
};

export default DeleteButton;
