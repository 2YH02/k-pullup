"use client";

import type { Device } from "@/app/mypage/page";
import { type Moment } from "@api/moment/get-moment-for-marker";
import Button from "@common/button";
import Divider from "@common/divider";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import AddMomentPage from "@pages/pullup/moment/add-moment-page";
import MomentItem from "@pages/pullup/moment/moment-item";
import {
  optimizeImage,
  OPTIMIZATION_PRESETS,
  ImageValidationError,
} from "@lib/optimize-image";
import useAlertStore from "@store/useAlertStore";
import useUserStore from "@store/useUserStore";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { BsUpload } from "react-icons/bs";

const MomentClient = ({
  deviceType,
  markerId,
  data,
}: {
  deviceType: Device;
  markerId: number;
  data: Moment[];
}) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useUserStore();
  const { openAlert } = useAlertStore();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  // TODO: 로딩 에러 처리
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [moments, setMoments] = useState(data);

  const addMoment = (moment: Moment) => {
    setMoments((prev) => [moment, ...prev]);
  };

  const deleteMoment = (momentId: number) => {
    setMoments((prev) => {
      const data = prev.filter((moment) => moment.storyID !== momentId);
      return data;
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);

    if (!e.target.files || !e.target.files[0]) {
      setLoading(false);
      return;
    }

    const selectedFileRaw = e.target.files[0];

    try {
      // Optimize image using the moment preset (optimized for portrait/story format)
      const optimizedFile = await optimizeImage(
        selectedFileRaw,
        OPTIMIZATION_PRESETS.moment
      );

      setSelectedFile(optimizedFile);
      const url = URL.createObjectURL(optimizedFile);
      setPreviewURL(url);
      setErrorMessage("");
    } catch (error) {
      if (error instanceof ImageValidationError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("이미지 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      e.target.value = "";
      setLoading(false);
    }
  };

  const handleBoxClick = () => {
    if (user?.error || !user) {
      openAlert({
        title: "접근 권한이 없습니다.",
        description: "로그인 후 다시 시도해 주세요.",
        onClick: () => {
          router.push(`/signin?returnUrl=/pullup/${markerId}/moment`);
        },
        cancel: true,
      });
      return;
    }
    fileInputRef.current?.click();
  };

  const clearSelect = () => {
    setSelectedFile(null);
    setPreviewURL(null);
  };

  if (selectedFile && previewURL) {
    return (
      <AddMomentPage
        deviceType={deviceType}
        url={previewURL}
        clear={clearSelect}
        imageFile={selectedFile}
        markerId={markerId}
        addMoment={addMoment}
      />
    );
  }

  if (moments.length <= 0) {
    return (
      <SideMain
        headerTitle="모먼트"
        fullHeight
        hasBackButton
        deviceType={deviceType}
        headerIcon={
          <BsUpload size={18} className="text-black dark:text-grey-light" />
        }
        headerIconClick={handleBoxClick}
      >
        <input
          type="file"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
        />
        <Section className="mt-10">
          <Text fontWeight="bold" textAlign="center" display="block">
            등록된 모먼트가 없습니다.
          </Text>
          <Text typography="t6" textAlign="center" display="block">
            다른 사람들과 당신의 순간을 공유해보세요!
          </Text>

          <div className="text-center mt-4">
            <Button full onClick={handleBoxClick} size="sm">
              등록하기
            </Button>
          </div>
        </Section>
      </SideMain>
    );
  }

  return (
    <SideMain
      headerTitle="모먼트"
      fullHeight
      hasBackButton
      deviceType={deviceType}
      headerIcon={
        <BsUpload size={18} className="text-black dark:text-grey-light" />
      }
      headerIconClick={handleBoxClick}
    >
      <div className="p-2" />
      <input
        type="file"
        onChange={handleImageChange}
        ref={fileInputRef}
        className="hidden"
      />
      {moments.map((moment, i) => {
        return (
          <div key={`${moment.caption} ${moment.createdAt}`}>
            <MomentItem moment={moment} filterMoment={deleteMoment} />
            {i !== moments.length - 1 && <Divider className="w-full h-4" />}
          </div>
        );
      })}
    </SideMain>
  );
};

export default MomentClient;
