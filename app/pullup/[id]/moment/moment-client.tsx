"use client";

import type { Device } from "@/app/mypage/page";
import { type Moment } from "@api/moment/get-moment-for-marker";
import Section from "@common/section";
import SideMain from "@common/side-main";
import AddMomentButton from "@pages/pullup/moment/add-moment-button";
import AddMomentPage from "@pages/pullup/moment/add-moment-page";
import MomentItem from "@pages/pullup/moment/moment-item";
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
    const suppertedFormats = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/webp",
    ];

    if (!e.target.files) {
      setLoading(false);
      return;
    }

    if (!suppertedFormats.includes(e.target.files[0]?.type)) {
      setErrorMessage(
        "지원되지 않은 이미지 형식입니다. JPEG, PNG, webp형식의 이미지를 업로드해주세요."
      );
      setLoading(false);
      return;
    }

    let file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewURL(url);
    }

    setErrorMessage("");

    e.target.value = "";
    setLoading(false);
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

  return (
    <SideMain
      headerTitle="모먼트"
      fullHeight
      hasBackButton
      deviceType={deviceType}
      headerIcon={<BsUpload />}
      headerIconClick={handleBoxClick}
    >
      <input
        type="file"
        onChange={handleImageChange}
        ref={fileInputRef}
        className="hidden"
      />
      {moments.map((moment) => {
        return (
          <MomentItem
            key={`${moment.caption} ${moment.createdAt}`}
            moment={moment}
            filterMoment={deleteMoment}
          />
        );
      })}
    </SideMain>
  );
};

export default MomentClient;
