"use client";

import type { ReportsRes, ReportStatus } from "@api/report/my-suggested";
import Badge from "@common/badge";
import Button from "@common/button";
import ShadowBox from "@common/shadow-box";
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
    <ShadowBox className="relative p-3 pt-6 mb-4">
      <div className="absolute right-3 top-3">
        <StatusBadge status={data.status} />
      </div>
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <Text fontWeight="bold">수정 요청 정보</Text>
        </div>
        <div>
          <div className="flex">
            <Text className="w-1/5">주소</Text>
            <Text typography="t6" className="w-4/5 truncate">
              {data.address}
            </Text>
          </div>
          <div className="flex">
            <Text className="w-1/5">설명</Text>
            <Text typography="t6" className="w-4/5 truncate">
              {data.description}
            </Text>
          </div>
        </div>
      </div>
      {images && (
        <div className="mb-4">
          <Text fontWeight="bold" className="mb-1">
            추가된 이미지
          </Text>
          <ImageCarousel data={images} />
        </div>
      )}

      <div className="flex justify-center mt-3">
        {data.status === "PENDING" && (
          <Button
            onClick={handleDelete}
            size="sm"
            variant="contrast"
            className="mr-4"
            full
          >
            요청 삭제
          </Button>
        )}
        <Button
          onClick={() => router.push(`/pullup/${data.markerId}`)}
          size="sm"
          full
        >
          위치 자세히 보기
        </Button>
      </div>
    </ShadowBox>
  );
};

export const StatusBadge = ({ status }: { status: ReportStatus }) => {
  const badgeText = useMemo(() => {
    if (status === "APPROVED") return "승인됨";
    else if (status === "DENIED") return "거절됨";
    else return "대기중";
  }, [status]);

  const iconBg = useMemo(() => {
    if (status === "APPROVED") return "bg-green";
    else if (status === "DENIED") return "bg-red";
    else return "bg-grey";
  }, [status]);

  return (
    <Badge
      text={badgeText}
      icon={<div className={`w-2 h-2 ${iconBg} rounded-full mr-1`} />}
      className="border-none"
    />
  );
};

export default ReportListItem;
