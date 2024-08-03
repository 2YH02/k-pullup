import IconButton from "@common/icon-button";
import useMapStore from "@store/useMapStore";
import { Trash2Icon } from "lucide-react";

interface DeleteButtonProps {
  markerId: number;
}

const DeleteButton = ({ markerId }: DeleteButtonProps) => {
  const { markers } = useMapStore();

  const handleDelete = () => {
    if (!markers) return;
    const marker = markers.find((marker) => marker.Gb === String(markerId));

    marker?.setMap(null);
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
