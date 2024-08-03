"use client";

import BottomFixedButton from "@common/bottom-fixed-button";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import Textarea from "@common/textarea";
import { ReportValue } from "@lib/api/report/report-marker";
import UploadImage from "@pages/register/upload-image";
import { useState } from "react";

interface ReportClientProps {
  id: number;
  lat: number;
  lng: number;
}

const ReportClient = ({ id, lat, lng }: ReportClientProps) => {
  const [reportValue, setReportValue] = useState<ReportValue>({
    markerId: id,
    latitude: lat,
    longitude: lng,
    description: "",
    photos: [],
  });

  const handleImageChange = (photos?: File[] | null) => {
    if (!photos) return;
    setReportValue((prev) => ({
      ...prev,
      photos: photos,
    }));
  };

  return (
    <SideMain
      headerTitle="정보 수정 요청"
      className="flex flex-col"
      fullHeight
      hasBackButton
    >
      <Section className="pb-0 h-40">
        <Text className="mb-1" fontWeight="bold">
          수정할 설명을 입력해주세요.
        </Text>
        <Textarea placeholder="해당 위치에 대한 설명을 40자 이내로 작성해주세요." />
      </Section>
      <div className="h-[calc(100%-240px)]">
        <UploadImage
          next={handleImageChange}
          withButton={false}
          title={["새로운 이미지를 추가해주세요. (필수!)"]}
        />
        <BottomFixedButton
          onClick={() => console.log(reportValue)}
          disabled={reportValue.photos.length <= 0}
        >
          수정 요청
        </BottomFixedButton>
      </div>
    </SideMain>
  );
};

export default ReportClient;
