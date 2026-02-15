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
import { ImagePlus, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

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
          <Upload size={18} strokeWidth={2.2} className="text-text-on-surface dark:text-grey-light" />
        }
        headerIconClick={handleBoxClick}
      >
        <input
          type="file"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
        />
        <Section className="mt-8">
          <div className="mx-auto max-w-sm rounded-2xl border border-grey-light/85 bg-search-input-bg/40 px-5 py-8 text-center motion-safe:animate-page-enter dark:border-grey-dark/85 dark:bg-black/30">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-primary/25 bg-primary/10 dark:border-primary-dark/45 dark:bg-primary-dark/25">
              <ImagePlus size={24} strokeWidth={2.1} className="text-primary dark:text-primary-light" />
            </div>
            <Text
              fontWeight="bold"
              textAlign="center"
              display="block"
              className="mb-1 text-text-on-surface dark:text-grey-light"
            >
              등록된 모먼트가 없습니다.
            </Text>
            <Text
              typography="t6"
              textAlign="center"
              display="block"
              className="text-grey-dark dark:text-grey"
            >
              첫 모먼트를 올려 순간을 공유해보세요.
            </Text>

            <div className="mt-5 text-center">
              <Button
                full
                onClick={handleBoxClick}
                size="sm"
                className="h-10"
              >
                모먼트 등록하기
              </Button>
            </div>
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
        <Upload size={18} strokeWidth={2.2} className="text-text-on-surface dark:text-grey-light" />
      }
      headerIconClick={handleBoxClick}
    >
      <Section className="py-2">
        <div className="rounded-xl border border-grey-light/85 bg-search-input-bg/35 px-3 py-2 dark:border-grey-dark/85 dark:bg-black/30">
          <Text typography="t6" className="text-grey-dark dark:text-grey">
            오늘의 운동 순간을 공유해보세요.
          </Text>
          {errorMessage && (
            <Text typography="t7" className="mt-1 text-red">
              {errorMessage}
            </Text>
          )}
        </div>
      </Section>
      <input
        type="file"
        onChange={handleImageChange}
        ref={fileInputRef}
        className="hidden"
      />
      {moments.map((moment, i) => {
        return (
          <div
            key={`${moment.caption} ${moment.createdAt}`}
            className="motion-safe:animate-page-enter motion-reduce:animate-none"
          >
            <MomentItem moment={moment} filterMoment={deleteMoment} />
            {i !== moments.length - 1 && (
              <Divider className="h-px w-full bg-black/10 dark:bg-white/10" />
            )}
          </div>
        );
      })}
    </SideMain>
  );
};

export default MomentClient;
