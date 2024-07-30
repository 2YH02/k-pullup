"use client";

import deleteReport from "@api/report/delete-report";
import Button from "@common/button";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import type { ReportsRes } from "@lib/api/report/my-suggested";
import ReportListItem from "@pages/mypage/report/report-list-item";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ReportClientProps {
  data: ReportsRes[];
}

const ReportClient = ({ data }: ReportClientProps) => {
  const router = useRouter();

  const [reports, setReports] = useState<ReportsRes[]>(data);

  const handleDelete = async (markerId: number, reportId: number) => {
    await deleteReport(markerId, reportId);

    setReports((prev) => {
      return prev.filter((item) => item.reportId !== reportId);
    });
  };

  if (reports.length <= 0) {
    return (
      <SideMain headerTitle="저장한 장소" hasBackButton>
        <Section className="mt-10">
          <Text display="block" textAlign="center" className="mb-5">
            요청한 장소가 없습니다.
          </Text>
          <Button onClick={() => router.push("/")} full>
            홈으로 가기
          </Button>
        </Section>
      </SideMain>
    );
  }

  return (
    <SideMain headerTitle="정보 수정 요청 목록" fullHeight hasBackButton>
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
