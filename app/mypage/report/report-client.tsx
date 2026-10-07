"use client";

import deleteReport from "@api/report/delete-report";
import type { ReportsRes } from "@api/report/my-suggested";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import NotFound from "@layout/not-found";
import ReportListItem from "@pages/mypage/report/report-list-item";
import useAlertStore from "@store/useAlertStore";
import { useState } from "react";
import type { Device } from "@/types/device";

interface ReportClientProps {
  data: ReportsRes[];
  referrer: boolean;
  deviceType?: Device;
}

const ReportClient = ({
  data,
  referrer,
  deviceType = "desktop",
}: ReportClientProps) => {
  const { openAlert } = useAlertStore();

  const [reports, setReports] = useState<ReportsRes[]>(data);

  const handleDelete = async (markerId: number, reportId: number) => {
    try {
      await deleteReport(markerId, reportId);

      setReports((prev) => {
        return prev.filter((item) => item.reportId !== reportId);
      });
      return true;
    } catch {
      openAlert({
        title: "삭제할 수 없습니다.",
        description: "잠시 후 다시 시도해주세요.",
        onClick: () => {},
      });
      return false;
    }
  };

  if (reports.length <= 0) {
    return (
      <NotFound
        headerTitle="내 정보 수정 제안"
        errorTitle="등록한 제안이 없습니다."
        fullHeight
        hasBackButton
        backFallbackUrl="/mypage"
      />
    );
  }

  return (
    <SideMain
      headerTitle="내 정보 수정 제안"
      fullHeight
      hasBackButton
      backFallbackUrl="/mypage"
      referrer={referrer}
      deviceType={deviceType}
    >
      <Section className="pb-3 pt-5">
        <div className="rounded-2xl border border-primary/12 bg-search-input-bg/45 p-4 dark:border-white/10 dark:bg-black/30">
          <Text typography="t7" display="block" className="text-grey-dark dark:text-grey">
            보낸 제안
          </Text>
          <Text typography="t4" fontWeight="bold" display="block" className="mt-0.5 text-primary dark:text-primary-light">
            {reports.length}건
          </Text>
          <Text typography="t7" display="block" className="mt-2 text-grey-dark dark:text-grey">
            내가 요청한 정보 수정 제안과 처리 상태입니다.
          </Text>
        </div>
      </Section>

      <Section className="pt-2">
        <ul className="space-y-2">
          {reports.map((report) => {
            return (
              <ReportListItem
                key={report.reportId}
                data={report}
                onDelete={handleDelete}
              />
            );
          })}
        </ul>
      </Section>
    </SideMain>
  );
};

export default ReportClient;
