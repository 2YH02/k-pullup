"use client";

import type { ReportsRes, ReportStatus } from "@api/report/my-suggested";
import Badge from "@common/badge";
import Button from "@common/button";
import Text from "@common/text";
import ImageCarousel from "@layout/image-carousel";
import useAlertStore from "@store/useAlertStore";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface ReportListItemProps {
  data: ReportsRes;
  onDelete: (markerId: number, reportId: number) => Promise<void>;
}

const ReportListItem = ({ data, onDelete }: ReportListItemProps) => {
  const router = useRouter();

  const { openAlert, closeAlert } = useAlertStore();

  const images = useMemo(() => {
    if (!data.photoUrls || data.photoUrls.length <= 0) return null;
    const newImages = data.photoUrls.map((image, index) => {
      return { markerId: index, photoURL: image };
    });

    return newImages;
  }, [data]);

  const handleDelete = () => {
    openAlert({
      title: "정말 삭제하시겠습니까?",
      description: "해당 요청이 삭제됩니다.",
      onClickAsync: async () => {
        await onDelete(data.markerId, data.reportId);
        closeAlert();
        router.refresh();
      },
      cancel: true,
    });
  };

  return (
    <li className="rounded-xl border border-primary/10 bg-surface/80 p-3 dark:border-grey-dark dark:bg-black">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <Text typography="t7" display="block" className="mb-0.5 text-grey-dark dark:text-grey">
            제안 #{data.reportId}
          </Text>
          <Text fontWeight="bold" display="block" className="text-primary dark:text-primary-light">
            정보 수정 제안
          </Text>
        </div>
        <StatusBadge status={data.status} />
      </div>

      <div className="mb-3">
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <Text typography="t6" display="block" className="w-10 shrink-0 text-grey-dark dark:text-grey">
              주소
            </Text>
            <Text typography="t6" display="block" className="wrap-break-word">
              {data.address}
            </Text>
          </div>
          <div className="flex gap-2">
            <Text typography="t6" display="block" className="w-10 shrink-0 text-grey-dark dark:text-grey">
              설명
            </Text>
            <Text typography="t6" display="block" className="wrap-break-word">
              {data.description}
            </Text>
          </div>
        </div>
      </div>

      {images && (
        <div className="mb-4">
          <Text typography="t6" fontWeight="bold" display="block" className="mb-1 text-primary dark:text-primary-light">
            추가된 이미지
          </Text>
          <ImageCarousel data={images} />
        </div>
      )}

      <div className="mt-3 flex gap-2">
        {data.status === "PENDING" && (
          <Button
            onClick={handleDelete}
            size="sm"
            variant="contrast"
            className="h-9 rounded-md"
            full
          >
            요청 삭제
          </Button>
        )}
        <Button
          onClick={() => router.push(`/pullup/${data.markerId}`)}
          size="sm"
          className="h-9 rounded-md"
          full
        >
          위치 자세히 보기
        </Button>
      </div>
    </li>
  );
};

export const StatusBadge = ({ status }: { status: ReportStatus }) => {
  const badgeText = useMemo(() => {
    if (status === "APPROVED") return "승인";
    else if (status === "DENIED") return "거절";
    else return "대기";
  }, [status]);

  const style = useMemo(() => {
    if (status === "APPROVED") {
      return {
        dot: "bg-green",
        badge: "bg-green/10 text-green border border-green/20",
      };
    }
    if (status === "DENIED") {
      return {
        dot: "bg-red",
        badge: "bg-red/10 text-red border border-red/20",
      };
    }
    return {
      dot: "bg-grey",
      badge: "bg-grey-light text-grey-dark border border-grey/25 dark:bg-grey-dark/20 dark:text-grey",
    };
  }, [status]);

  return (
    <Badge
      text={badgeText}
      icon={<div className={`h-2 w-2 ${style.dot} rounded-full`} />}
      withBorder={false}
      className={`px-2.5 py-1 ${style.badge}`}
      textStyle="text-[12px]"
    />
  );
};

export default ReportListItem;
