import useAlertStore from "@/store/useAlertStore";
import useUserStore from "@/store/useUserStore";
import deleteMoment from "@api/moment/delete-moment";
import type { Moment } from "@api/moment/get-moment-for-marker";
import Text from "@common/text";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";

interface MomentItem {
  moment: Moment;
  filterMoment: (momentId: number) => void;
}

const MomentItem = ({ moment, filterMoment }: MomentItem) => {
  const { user } = useUserStore();
  const { openAlert, closeAlert } = useAlertStore();

  const handledelete = () => {
    openAlert({
      title: "삭제",
      description: "정말 삭제하시겠습니까?",
      cancel: true,
      onClickAsync: async () => {
        const res = await deleteMoment(moment.markerID, moment.storyID);
        if (!res.ok) {
          openAlert({
            title: "실패",
            description: "잠시 후 다시 시도해주세요.",
            cancel: true,
            onClick: () => {},
          });
        } else {
          filterMoment(moment.storyID);
          closeAlert();
        }
      },
    });
  };
  return (
    <div className="mb-6">
      <div className="relative w-full h-96">
        <Image
          src={moment.photoURL}
          fill
          alt={moment.caption}
          className="object-cover"
        />
        <div className="absolute top-0 left-0 p-2 flex items-center justify-between h-10 w-full bg-[rgba(0,0,0,0.3)]">
          <span className="text-white">{moment.username}</span>
          {user && user.userId === moment.userID && (
            <button onClick={handledelete}>
              <Trash2Icon size={20} color="white" />
            </button>
          )}
        </div>
      </div>
      <div className="w-full flex flex-col justify-center p-2">
        <Text className="text-wrap break-words">
          {moment.caption}
        </Text>
      </div>
    </div>
  );
};

export default MomentItem;
