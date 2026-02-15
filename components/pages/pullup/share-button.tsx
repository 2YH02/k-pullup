"use client";

import BottomSheet, { BottomSheetItem } from "@/components/common/bottom-sheet";
import { useBottomSheetStore } from "@/store/useBottomSheetStore";
import convertWgs from "@api/marker/convert-wgs";
import IconButton from "@common/icon-button";
import useGps from "@hooks/useGps";
import { useToast } from "@hooks/useToast";
import downloadPdf from "@lib/api/marker/download-pdf";
import { FileDown, Link2, MapPinned, Route, Share2 } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  markerId: number;
  lat: number;
  lng: number;
  address: string;
}

const ShareButton = ({ markerId, lat, lng, address }: ShareButtonProps) => {
  const { show } = useBottomSheetStore();
  const { toast } = useToast();
  const { handleGps } = useGps();

  const [downLoading, setDownLoading] = useState(false);

  const copyTextToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://www.k-pullup.com/pullup/${markerId}`
      );
      toast({
        description: "링크 복사 완료",
      });
    } catch (err) {
      toast({
        description: "잠시 후 다시 시도해 주세요!",
      });
    }
  };
  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast({
        description: "주소 복사 완료",
      });
    } catch (err) {
      toast({
        description: "잠시 후 다시 시도해 주세요!",
      });
    }
  };

  const downloadMap = async () => {
    setDownLoading(true);
    const response = await downloadPdf({ lat, lng });

    if (!response.ok) {
      setDownLoading(false);
      toast({
        description: "잠시 후 다시 시도해주세요.",
      });
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `${markerId}.pdf`;

    setDownLoading(false);

    a.click();
    URL.revokeObjectURL(url);
  };

  const openLocation = async () => {
    const myLocate = handleGps();
    if (myLocate) {
      const sp = await convertWgs(myLocate.lat, myLocate.lng);
      const dst = await convertWgs(lat, lng);

      if (sp && dst) {
        let url = `https://map.kakao.com/?map_type=TYPE_MAP&target=walk&rt=${sp.X},${sp.Y},${dst.X},${dst.Y}&rt1=내 위치&rt2=${address}`;

        // kakaomap://route?sp=37.53723,127.00551&ep=37.49795,127.027637&by=FOOT
        window.open(url, "_blank");
      }
    }
  };

  return (
    <>
      <div className="relative flex-1">
        <IconButton
          icon={
            <Share2
              size={20}
              strokeWidth={2.2}
              className="text-primary dark:text-primary-light"
            />
          }
          text="공유 / 길찾기"
          className="w-full active:bg-black/5 dark:active:bg-white/10"
          onClick={() => {
            show(`share-${markerId}`);
          }}
        />
      </div>
      <BottomSheet
        title="공유 / 길찾기"
        id={`share-${markerId}`}
        className="pb-10"
      >
        <BottomSheetItem
          icon={
            <MapPinned
              size={20}
              strokeWidth={2.2}
              className="text-location-badge-text dark:text-location-badge-text-dark"
            />
          }
          iconWrapClassName="border-location-badge-bg/85 bg-location-badge-bg/65 dark:border-location-badge-bg-dark/75 dark:bg-location-badge-bg-dark/45"
          onClick={copyAddress}
        >
          주소 복사
        </BottomSheetItem>
        <BottomSheetItem
          icon={
            <Link2
              size={20}
              strokeWidth={2.2}
              className="text-location-badge-text dark:text-location-badge-text-dark"
            />
          }
          iconWrapClassName="border-location-badge-bg/85 bg-location-badge-bg/65 dark:border-location-badge-bg-dark/75 dark:bg-location-badge-bg-dark/45"
          onClick={copyTextToClipboard}
        >
          철봉 링크 복사
        </BottomSheetItem>
        <BottomSheetItem
          icon={
            <Route
              size={20}
              strokeWidth={2.2}
              className="text-location-badge-text dark:text-location-badge-text-dark"
            />
          }
          iconWrapClassName="border-location-badge-bg/85 bg-location-badge-bg/65 dark:border-location-badge-bg-dark/75 dark:bg-location-badge-bg-dark/45"
          onClick={openLocation}
        >
          길찾기
        </BottomSheetItem>
        <BottomSheetItem
          icon={
            <FileDown
              size={20}
              strokeWidth={2.2}
              className="text-location-badge-text dark:text-location-badge-text-dark"
            />
          }
          iconWrapClassName="border-location-badge-bg/85 bg-location-badge-bg/65 dark:border-location-badge-bg-dark/75 dark:bg-location-badge-bg-dark/45"
          onClick={downloadMap}
          disabled={downLoading}
        >
          PDF 저장
        </BottomSheetItem>
      </BottomSheet>
    </>
  );
};

export default ShareButton;
