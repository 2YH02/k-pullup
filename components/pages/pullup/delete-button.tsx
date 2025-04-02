import deleteMarker from "@api/marker/delete-marker";
import IconButton from "@common/icon-button";
import { useToast } from "@hooks/useToast";
import useAlertStore from "@store/useAlertStore";
import useMarkerStore from "@store/useMarkerStore";
import { useRouter } from "next/navigation";
import { BsTrash } from "react-icons/bs";

interface DeleteButtonProps {
  markerId: number;
}

const DeleteButton = ({ markerId }: DeleteButtonProps) => {
  const router = useRouter();

  const { deleteMarker: deleteOne } = useMarkerStore();
  const { openAlert, closeAlert } = useAlertStore();
  const { toast } = useToast();

  const handleDelete = async () => {
    const response = await deleteMarker(markerId);

    if (!response.ok) {
      toast({ description: "잠시 후 다시 시도해주세요" });
      return;
    }

    deleteOne(markerId);
    closeAlert();
    router.replace("/");
  };

  const handleClick = () => {
    openAlert({
      title: "정말 삭제하시겠습니까?",
      description: "해당 위치에 대한 정보가 모두 삭제됩니다.",
      onClickAsync: handleDelete,
      cancel: true,
    });
  };
  return (
    <IconButton
      icon={<BsTrash size={20} className="fill-primary" />}
      text="삭제"
      className="flex-1"
      onClick={handleClick}
    />
  );
};

export default DeleteButton;
