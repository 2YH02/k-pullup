"use client";

import approveReport from "@api/report/approve-report";
import denyReport from "@api/report/deny-report";
import type {
  MyMarkerReportRes,
  Report,
} from "@api/report/report-for-mymarker";
import BottomFixedButton from "@common/bottom-fixed-button";
import Button from "@common/button";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import ImageCarousel from "@layout/image-carousel";
import { StatusBadge } from "@pages/mypage/report/report-list-item";
import useAlertStore from "@store/useAlertStore";
import { ChevronRight, FilePenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { type Device } from "../page";

interface MyreportClientProps {
  data: MyMarkerReportRes;
  referrer?: boolean;
  deviceType?: Device;
}

const MyreportClient = ({
  data,
  referrer,
  deviceType = "desktop",
}: MyreportClientProps) => {
  const router = useRouter();

  const { openAlert, closeAlert } = useAlertStore();

  const [curData, setCurData] = useState<Report | null>(null);
  const [curAddr, setCurAddr] = useState("");
  const [markerId, setMarkerId] = useState<string | null>(null);

  const markerGroups = useMemo(() => Object.entries(data.markers), [data.markers]);

  const images = useMemo(() => {
    if (!curData) return;

    return curData.photos.map((image, index) => {
      return { markerId: index, photoURL: image };
    });
  }, [curData]);

  const handleDeny = () => {
    if (!curData || !markerId) {
      openAlert({
        title: "거절할 수 없습니다.",
        description: "선택된 요청이 없습니다.",
        onClick: () => {},
      });
      return;
    }

    openAlert({
      title: "정말 거절하시겠습니까?",
      description: "다시 승인할 수 없습니다.",
      onClickAsync: async () => {
        const response = await denyReport(curData.reportID);
        if (!response.ok) {
          closeAlert();
          openAlert({
            title: "거절할 수 없습니다.",
            description: "잠시 후 다시 시도해주세요.",
            onClick: () => {},
          });

          router.refresh();
          return;
        }

        openAlert({
          title: "거절 완료",
          description: "거절이 완료되었습니다.",
          onClick: () => {},
        });

        setCurData((prev) => {
          if (!prev) return null;
          return { ...prev, status: "DENIED" };
        });

        router.refresh();
      },
      cancel: true,
    });
  };

  const handleApprove = () => {
    if (!curData || !markerId) {
      openAlert({
        title: "승인할 수 없습니다.",
        description: "선택된 요청이 없습니다.",
        onClick: () => {},
      });
      return;
    }

    openAlert({
      title: "정말 승인하시겠습니까?",
      description: "해당 위치의 정보가 바뀝니다.",
      onClickAsync: async () => {
        const response = await approveReport(curData.reportID);
        if (!response.ok) {
          closeAlert();
          openAlert({
            title: "승인할 수 없습니다.",
            description: "잠시 후 다시 시도해주세요.",
            onClick: () => {},
          });

          router.refresh();
          return;
        }

        openAlert({
          title: "승인 완료",
          description: "승인이 완료되었습니다.",
          onClick: () => {},
        });

        setCurData((prev) => {
          if (!prev) return null;
          return { ...prev, status: "APPROVED" };
        });

        router.refresh();
      },
      cancel: true,
    });
  };

  if (curData) {
    return (
      <SideMain
        headerTitle="수정 요청 상세"
        fullHeight
        hasBackButton
        prevClick={() => {
          setMarkerId(null);
          setCurData(null);
        }}
        referrer={!!referrer}
        deviceType={deviceType}
        backFallbackUrl="/mypage"
      >
        <Section className="pb-2">
          <div className="rounded-xl border border-primary/10 bg-surface/80 px-4 py-3 dark:border-grey-dark dark:bg-black">
            <Text typography="t7" display="block" className="mb-0.5 text-grey-dark dark:text-grey">
              받은 제안
            </Text>
            <Text fontWeight="bold" display="block" className="text-primary dark:text-primary-light">
              {curAddr}
            </Text>
          </div>
        </Section>

        <Section className="pt-2">
          <div className="rounded-xl border border-primary/10 bg-surface/80 p-3 dark:border-grey-dark dark:bg-black">
            <div className="mb-3 flex items-start justify-between gap-2">
              <Text fontWeight="bold" display="block" className="text-primary dark:text-primary-light">
                수정 요청 정보
              </Text>
              <StatusBadge status={curData.status} />
            </div>

            <div className="space-y-1.5">
              <div className="flex gap-2">
                <Text typography="t6" display="block" className="w-10 shrink-0 text-grey-dark dark:text-grey">
                  주소
                </Text>
                <Text typography="t6" display="block" className="wrap-break-word">
                  {curAddr}
                </Text>
              </div>
              <div className="flex gap-2">
                <Text typography="t6" display="block" className="w-10 shrink-0 text-grey-dark dark:text-grey">
                  설명
                </Text>
                <Text typography="t6" display="block" className="wrap-break-word">
                  {curData.description}
                </Text>
              </div>
            </div>

            {images && images.length > 0 && curData.status !== "APPROVED" && (
              <div className="mb-4 mt-4">
                <Text
                  typography="t6"
                  fontWeight="bold"
                  display="block"
                  className="mb-1 text-primary dark:text-primary-light"
                >
                  추가된 이미지
                </Text>
                <ImageCarousel data={images} />
              </div>
            )}

            {curData.status === "PENDING" && (
              <div className="mt-3 flex gap-2">
                <Button
                  onClick={handleDeny}
                  size="sm"
                  className="h-9 rounded-md"
                  variant="contrast"
                  full
                >
                  거절
                </Button>
                <Button onClick={handleApprove} size="sm" className="h-9 rounded-md" full>
                  승인
                </Button>
              </div>
            )}
          </div>
        </Section>

        <BottomFixedButton
          onClick={() => router.push(`/pullup/${markerId}`)}
          containerStyle="border-t border-primary/10 dark:border-grey-dark"
        >
          위치 상세 보기
        </BottomFixedButton>
      </SideMain>
    );
  }

  return (
    <SideMain
      headerTitle="받은 정보 수정 제안"
      fullHeight
      hasBackButton
      backFallbackUrl="/mypage"
      referrer={!!referrer}
      deviceType={deviceType}
    >
      <Section className="pb-2">
        <div className="rounded-xl border border-primary/10 bg-surface/80 px-4 py-3 dark:border-grey-dark dark:bg-black">
          <Text fontWeight="bold" display="block" className="text-primary dark:text-primary-light">
            내 위치에 들어온 수정 제안
          </Text>
          <Text typography="t6" className="mt-0.5 text-grey-dark dark:text-grey">
            총 <span className="font-bold text-primary dark:text-primary-light">{data.totalReports}</span>
            건의 제안을 받았어요
          </Text>
        </div>
      </Section>

      {markerGroups.map(([key, { markerID, reports, address }]) => {
        return (
          <Section key={key} className="py-2">
            <div className="rounded-xl border border-primary/10 bg-surface/80 p-3 dark:border-grey-dark dark:bg-black">
              <div className="mb-2 flex items-center justify-between gap-2">
                <Text fontWeight="bold" display="block" className="truncate text-primary dark:text-primary-light">
                  {address || "주소 제공 안됨"}
                </Text>
                <Text typography="t7" display="block" className="shrink-0 text-grey-dark dark:text-grey">
                  {reports.length}건
                </Text>
              </div>

              <div className="scrollbar-hidden flex gap-2 overflow-x-auto overflow-y-hidden py-1">
                {reports.map((report) => (
                  <button
                    key={report.reportID}
                    className="group min-w-60 cursor-pointer rounded-lg border border-primary/8 bg-search-input-bg/50 dark:bg-black/35 p-3 text-left transition-[transform,background-color,border-color] duration-180 ease-out web:hover:border-primary/16 web:hover:bg-search-input-bg/65 active:scale-[0.99] dark:border-grey-dark dark:web:hover:bg-black/45"
                    onClick={() => {
                      setMarkerId(markerID.toString());
                      setCurData(report);
                      setCurAddr(address || "주소 제공 안됨");
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <StatusBadge status={report.status} />
                      <FilePenLine
                        size={16}
                        className="text-primary/80 dark:text-primary-light/80"
                      />
                    </div>
                    <Text typography="t7" display="block" className="line-clamp-2 text-grey-dark dark:text-grey">
                      {report.description || "설명 제공 안됨"}
                    </Text>
                    <div className="mt-2 flex items-center text-grey-dark dark:text-grey">
                      <Text typography="t7" display="block">상세 보기</Text>
                      <ChevronRight size={14} className="ml-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Section>
        );
      })}
    </SideMain>
  );
};

export default MyreportClient;
