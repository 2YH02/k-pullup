"use client";

import ShadowBox from "@/components/common/shadow-box";
import { Received } from "@/components/pages/mypage/link-list";
import approveReport from "@api/report/approve-report";
import denyReport from "@api/report/deny-report";
import type {
  MyMarkerReportRes,
  Report,
} from "@api/report/report-for-mymarker";
import BottomFixedButton from "@common/bottom-fixed-button";
import Button from "@common/button";
import { Carousel, CarouselContent, CarouselItem } from "@common/carousel";
import Section, { SectionTitle } from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import ImageCarousel from "@layout/image-carousel";
import { StatusBadge } from "@pages/mypage/report/report-list-item";
import useAlertStore from "@store/useAlertStore";
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
  const [markerId, setMarkerId] = useState<string | null>(null);

  const images = useMemo(() => {
    if (!curData) return;
    const newImages = curData?.photos.map((image, index) => {
      return { markerId: index, photoURL: image };
    });

    return newImages;
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

  const reportItems = Object.entries(data.markers).map(([key, reports]) => {
    return (
      <Section key={key}>
        <SectionTitle title={`${reports[0].address || "주소 제공 안됨"}`} />
        <Carousel opts={{ dragFree: true }}>
          <CarouselContent className="-ml-1 gap-3 w-64 h-20 p-1">
            {reports.map((report) => (
              <CarouselItem className="p-0" key={report.reportID}>
                <ShadowBox
                  onClick={() => {
                    setMarkerId(key);
                    setCurData(report);
                  }}
                  className="w-full h-full flex items-center justify-center p-3"
                  withAction
                >
                  <div className="w-1/5 shrink-0">
                    <Received size={30} />
                  </div>
                  <Text className="w-4/5 shrink-0 truncate">
                    {report.description || "설명 제공 안됨"}
                  </Text>
                </ShadowBox>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </Section>
    );
  });

  if (curData) {
    return (
      <SideMain
        headerTitle={curData.address || "주소 제공 안됨"}
        fullHeight
        hasBackButton
        prevClick={() => {
          setMarkerId(null);
          setCurData(null);
        }}
        referrer={!!referrer}
        deviceType={deviceType}
      >
        <Section className="relative p-4 pt-6 mb-4 mt-5">
          <div className="absolute right-3 top-3">
            <StatusBadge status={curData.status} />
          </div>
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <Text fontWeight="bold">수정 요청 정보</Text>
            </div>
            <div>
              <div className="flex">
                <Text className="w-1/5">주소</Text>
                <Text typography="t6" className="w-4/5 truncate">
                  {curData.address || "주소 제공 안됨"}
                </Text>
              </div>
              <div className="flex">
                <Text className="w-1/5">설명</Text>
                <Text typography="t6" className="w-4/5 truncate">
                  {curData.description}
                </Text>
              </div>
            </div>
          </div>

          {images && curData.status !== "APPROVED" && (
            <div className="mb-4">
              <Text fontWeight="bold" className="mb-1">
                추가된 이미지
              </Text>
              <ImageCarousel data={images} size="md" />
            </div>
          )}

          {curData.status === "PENDING" && (
            <div className="flex justify-center mt-3">
              <Button
                onClick={handleDeny}
                size="sm"
                className="mr-4"
                variant="contrast"
              >
                거절
              </Button>
              <Button onClick={handleApprove} size="sm">
                승인
              </Button>
            </div>
          )}
        </Section>

        <BottomFixedButton onClick={() => router.push(`/pullup/${markerId}`)}>
          위치 상세 보기
        </BottomFixedButton>
      </SideMain>
    );
  }

  return (
    <SideMain headerTitle="받은 정보 수정 요청 목록" fullHeight hasBackButton>
      {reportItems}
    </SideMain>
  );
};

export default MyreportClient;
