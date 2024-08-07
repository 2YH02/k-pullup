"use client";

import deleteReport from "@api/report/delete-report";
import type { ReportsRes } from "@api/report/my-suggested";
import Section from "@common/section";
import SideMain from "@common/side-main";
import NotFound from "@layout/not-found";
import ReportListItem from "@pages/mypage/report/report-list-item";
import { useState } from "react";

interface ReportClientProps {
  data: ReportsRes[];
}

const ReportClient = ({ data }: ReportClientProps) => {

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
        headerTitle="내가 요청한 수정 목록"
        errorTitle=" 요청한 장소가 없습니다."
        fullHeight
        hasBackButton
      />
    );
  }

  return (
    <SideMain headerTitle="내가 요청한 수정 목록" fullHeight hasBackButton>
      <Section>
        {reports.map((report) => {
          return (
            <ReportListItem
              key={report.reportId}
              data={report}
              onDelete={handleDelete}
            />
          );
        })}
      </Section>
    </SideMain>
  );
};

export default ReportClient;
