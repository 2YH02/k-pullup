"use client";

import deleteReport from "@api/report/delete-report";
import type { ReportsRes } from "@api/report/my-suggested";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import NotFound from "@layout/not-found";
import ReportListItem from "@pages/mypage/report/report-list-item";
import { useState } from "react";
import { type Device } from "../page";

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
  const [reports, setReports] = useState<ReportsRes[]>(data);

  const handleDelete = async (markerId: number, reportId: number) => {
    await deleteReport(markerId, reportId);

    setReports((prev) => {
      return prev.filter((item) => item.reportId !== reportId);
    });
  };

  if (reports.length <= 0 || !reports) {
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
      <Section className="pb-2">
        <div className="rounded-xl border border-primary/10 bg-surface/80 px-4 py-3 dark:border-grey-dark dark:bg-black">
          <Text fontWeight="bold" display="block" className="text-primary dark:text-primary-light">
            내가 제안한 수정 목록
          </Text>
          <Text typography="t6" className="mt-0.5 text-grey-dark dark:text-grey">
            총 <span className="font-bold text-primary dark:text-primary-light">{reports.length}</span>
            건의 제안을 보냈어요
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
