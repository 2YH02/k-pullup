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

  const handleDelete = () => {
    openAlert({
      title: "모먼트를 삭제할까요?",
      description: "삭제한 모먼트는 다시 복구할 수 없습니다.",
      cancel: true,
      onClickAsync: async () => {
        try {
          await deleteMoment(moment.markerID, moment.storyID);
          filterMoment(moment.storyID);
          closeAlert();
        } catch {
          openAlert({
            title: "삭제하지 못했습니다.",
            description: "잠시 후 다시 시도해 주세요.",
            onClick: () => {},
          });
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
            type="button"
            onClick={handleDelete}
            className="flex size-8 items-center justify-center rounded-full text-grey-dark transition-[transform,background-color,color] duration-150 active:scale-[0.96] active:bg-black/5 active:text-black focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/35 motion-reduce:transform-none motion-reduce:transition-none dark:text-grey dark:active:bg-white/10 dark:active:text-white"
            aria-label="모먼트 삭제"
          >
            <X size={20} strokeWidth={2.2} />
          </button>
        )}
      </div>
      {moment.caption?.trim() && (
        <div className="mb-2 flex w-full flex-col justify-center">
          <Text className="whitespace-pre-wrap wrap-break-word text-text-on-surface dark:text-grey-light">
            {moment.caption}
          </Text>
        </div>
      )}
      <button
        type="button"
        className="relative aspect-4/5 w-full overflow-hidden rounded-xl border border-primary/10 bg-search-input-bg/50 text-left active:scale-[0.995] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/35 motion-reduce:transform-none dark:border-grey-dark dark:bg-black/35"
        onClick={() => {
          openModal({ images: [moment.photoURL], curIndex: 0 });
        }}
        aria-label="모먼트 이미지 크게 보기"
      >
        <Image
          src={moment.photoURL}
          fill
          alt={moment.caption?.trim() || `${moment.username}님의 운동 모먼트`}
          sizes="(max-width: 484px) 100vw, 384px"
          className="object-cover transition-transform duration-200 web:hover:scale-[1.01] motion-reduce:transform-none motion-reduce:transition-none"
        />
      </button>
    </div>
  );
};

export default MomentItem;
