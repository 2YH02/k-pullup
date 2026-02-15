import deleteMoment from "@api/moment/delete-moment";
import type { Moment } from "@api/moment/get-moment-for-marker";
import Text from "@common/text";
import { formatDate } from "@lib/format-date";
import useAlertStore from "@store/useAlertStore";
import useImageModalStore from "@store/useImageModalStore";
import useUserStore from "@store/useUserStore";
import { X } from "lucide-react";
import Image from "next/image";

interface MomentItem {
  moment: Moment;
  filterMoment: (momentId: number) => void;
}

const MomentItem = ({ moment, filterMoment }: MomentItem) => {
  const { user } = useUserStore();
  const { openAlert, closeAlert } = useAlertStore();
  const { openModal } = useImageModalStore();

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
    <div className="px-4 py-3">
      <div className="mb-2 flex h-10 w-full items-center justify-between">
        <div className="flex flex-col">
          <Text fontWeight="bold" className="text-text-on-surface dark:text-grey-light">
            {moment.username}
          </Text>
          <Text typography="t7" className="text-grey-dark dark:text-grey">
            {formatDate(moment.createdAt)}
          </Text>
        </div>
        {user && user.userId === moment.userID && (
          <button
            onClick={handledelete}
            className="rounded-full p-1 text-grey-dark transition-colors duration-150 active:scale-[0.96] active:bg-black/5 active:text-black focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/35 dark:text-grey dark:active:bg-white/10 dark:active:text-white"
            aria-label="모먼트 삭제"
          >
            <X size={20} strokeWidth={2.2} />
          </button>
        )}
      </div>
      <div className="mb-2 flex w-full flex-col justify-center">
        <Text className="text-wrap wrap-break-word text-text-on-surface dark:text-grey-light">
          {moment.caption}
        </Text>
      </div>
      <button
        type="button"
        className="relative h-96 w-full overflow-hidden rounded-xl border border-grey-light/80 text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/35 dark:border-grey-dark/80"
        onClick={() => {
          openModal({ images: [moment.photoURL], curIndex: 0 });
        }}
        aria-label="모먼트 이미지 크게 보기"
      >
        <Image
          src={moment.photoURL}
          fill
          alt={moment.caption}
          className="object-cover transition-transform duration-200 active:scale-[1.01]"
        />
      </button>
    </div>
  );
};

export default MomentItem;
