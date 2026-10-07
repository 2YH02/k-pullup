"use client";

import type { Device } from "@/types/device";
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
import { useEffect, useRef, useState } from "react";

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

  // previewURL 이 교체되거나 컴포넌트가 언마운트될 때 이전 object URL 을 해제한다.
  // (revoke 사이드 이펙트는 setState updater 대신 effect cleanup 에서 처리)
  useEffect(() => {
    if (!previewURL) return;
    return () => {
      URL.revokeObjectURL(previewURL);
    };
  }, [previewURL]);

  // 로딩/에러 상태
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
    if (loading) return;
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
        setErrorMessage("이미지를 처리하지 못했습니다. 다시 시도해 주세요.");
      }
    } finally {
      e.target.value = "";
      setLoading(false);
    }
  };

  const handleBoxClick = () => {
    if (loading) return;

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
        backFallbackUrl={`/pullup/${markerId}`}
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
          accept="image/*"
          aria-label="모먼트 사진 선택"
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
              아직 등록된 모먼트가 없어요
            </Text>
            <Text
              typography="t6"
              textAlign="center"
              display="block"
              className="text-grey-dark dark:text-grey"
            >
              이 장소의 첫 운동 순간을 공유해 보세요.
            </Text>

            {errorMessage && (
              <Text
                typography="t7"
                display="block"
                className="mt-3 text-red dark:text-red"
              >
                {errorMessage}
              </Text>
            )}

            <div className="mt-5 text-center">
              <Button
                full
                onClick={handleBoxClick}
                size="sm"
                className="h-10"
                disabled={loading}
              >
                {loading ? "처리 중..." : "모먼트 등록하기"}
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
      backFallbackUrl={`/pullup/${markerId}`}
      deviceType={deviceType}
      headerIcon={
        <Upload size={18} strokeWidth={2.2} className="text-text-on-surface dark:text-grey-light" />
      }
      headerIconClick={handleBoxClick}
    >
      <Section className="pb-2 pt-4">
        <div className="rounded-2xl border border-primary/12 bg-search-input-bg/45 p-4 dark:border-white/10 dark:bg-black/30">
          <Text typography="t7" display="block" className="text-grey-dark dark:text-grey">
            이 장소의 모먼트
          </Text>
          <Text typography="t4" fontWeight="bold" display="block" className="mt-0.5 text-primary dark:text-primary-light">
            {moments.length}개
          </Text>
          <Text typography="t7" display="block" className="mt-2 text-grey-dark dark:text-grey">
            {loading ? "사진을 준비하고 있습니다." : "운동 사진과 짧은 기록을 남겨 보세요."}
          </Text>
          {errorMessage && (
            <Text typography="t7" display="block" className="mt-2 text-red" aria-live="polite">
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
        accept="image/*"
        aria-label="모먼트 사진 선택"
      />
      {moments.map((moment, i) => {
        return (
          <div
            key={moment.storyID}
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
