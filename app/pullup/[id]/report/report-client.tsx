"use client";

import { type Device } from "@/app/mypage/page";
import { Marker } from "@/types/marker.types";
import BottomFixedButton from "@common/bottom-fixed-button";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import Textarea from "@common/textarea";
import { useToast } from "@hooks/useToast";
import reportMarker, { ReportValue } from "@lib/api/report/report-marker";
import ReportCompleted from "@pages/pullup/report/report-completed";
import UploadImage from "@pages/pullup/upload-image";
import useAlertStore from "@store/useAlertStore";
import { useState } from "react";

interface ReportClientProps {
  marker: Marker;
  deviceType: Device;
}

const ReportClient = ({
  marker,
  deviceType = "desktop",
}: ReportClientProps) => {
  const { openAlert } = useAlertStore();
  const { toast } = useToast();

  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [reportValue, setReportValue] = useState<ReportValue>({
    markerId: marker.markerId,
    latitude: marker.latitude,
    longitude: marker.longitude,
    description: marker.description,
    photos: [],
  });

  const handleImageChange = (photos?: File[] | null) => {
    if (!photos) return;

    setReportValue((prev) => ({
      ...prev,
      photos: photos,
    }));
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReportValue((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  const onSubmit = async () => {
    setLoading(true);
    if (reportValue.photos.length <= 0) return;
    const sizeMap = reportValue.photos.map((photo) => {
      return photo.size / (1024 * 1024);
    });
    const totalSize = sizeMap.reduce((a, b) => a + b);

    if (totalSize > 28) {
      openAlert({
        title: "이미지 용량 초과",
        description: "최대 30MB까지 이미지를 등록할 수 있습니다.",
        onClick: () => {},
      });
      setLoading(false);
      return;
    }
    const response = await reportMarker(reportValue);

    if (!response.ok) {
      toast({
        description: "잠시 후 다시 시도해주세요",
      });
      setLoading(false);
      return;
    }

    setLoading(false);
    setCompleted(true);
  };

  if (completed) {
    return <ReportCompleted />;
  }

  return (
    <SideMain
      headerTitle="정보 수정 요청"
      className="flex flex-col"
      fullHeight
      hasBackButton
      deviceType={deviceType}
    >
      <Section className="pb-0 h-40">
        <Text className="mb-1" fontWeight="bold">
          수정할 설명을 입력해주세요.
        </Text>
        <Textarea
          placeholder="해당 위치에 대한 설명을 40자 이내로 작성해주세요."
          value={reportValue.description}
          onChange={handleDescChange}
        />
      </Section>
      <div className="h-[calc(100%-240px)]">
        <UploadImage
          next={handleImageChange}
          withButton={false}
          title={["새로운 이미지를 추가해주세요. (필수!)"]}
        />
        <BottomFixedButton
          onClick={onSubmit}
          disabled={reportValue.photos.length <= 0 || loading}
        >
          수정 요청
        </BottomFixedButton>
      </div>
    </SideMain>
  );
};

export default ReportClient;
