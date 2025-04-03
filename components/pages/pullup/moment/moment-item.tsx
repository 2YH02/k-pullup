import deleteMoment from "@api/moment/delete-moment";
import type { Moment } from "@api/moment/get-moment-for-marker";
import Text from "@common/text";
import { formatDate } from "@lib/format-date";
import useAlertStore from "@store/useAlertStore";
import useUserStore from "@store/useUserStore";
import Image from "next/image";
import { BsX } from "react-icons/bs";

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
    <div className="py-3">
      <div className="px-2 flex items-center justify-between h-10 w-full">
        <div className="flex flex-col">
          <Text fontWeight="bold">{moment.username}</Text>
          <Text typography="t7" className="text-grey">
            {formatDate(moment.createdAt)}
          </Text>
        </div>
        {user && user.userId === moment.userID && (
          <button onClick={handledelete}>
            <BsX size={24} className="text-grey dark:text-grey" />
          </button>
        )}
      </div>
      <div className="w-full flex flex-col justify-center px-2">
        <Text className="text-wrap break-words">{moment.caption}</Text>
      </div>
      <div className="relative w-full h-96">
        <Image
          src={moment.photoURL}
          fill
          alt={moment.caption}
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default MomentItem;
