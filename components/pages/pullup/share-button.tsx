"use client";

import Button from "@common/button";
import IconButton from "@common/icon-button";
import Text from "@common/text";
import { useToast } from "@hooks/useToast";
import CloseIcon from "@icons/close-icon";
import LoadingIcon from "@icons/loading-icon";
import downloadPdf from "@lib/api/marker/download-pdf";
import { ShareIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ShareButtonProps {
  markerId: number;
  lat: number;
  lng: number;
}

const ShareButton = ({ markerId, lat, lng }: ShareButtonProps) => {
  const { toast } = useToast();

  const [viewModal, setViewModal] = useState(false);

  const [downLoading, setDownLoading] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        modalRef.current &&
        buttonRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setViewModal(false);
      }
    };
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [modalRef, buttonRef]);

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

  const downloadMap = async () => {
    setDownLoading(true);
    const response = await downloadPdf({ lat, lng });

    if (!response.ok) {
      setDownLoading(false);
      setViewModal(false);
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
    a.click();
    setDownLoading(false);
  };

  return (
    <div className="relative flex-1">
      <IconButton
        icon={<ShareIcon size={25} className="stroke-primary" />}
        text="공유"
        className="w-full"
        onClick={() => setViewModal(true)}
        ref={buttonRef}
      />
      {viewModal && (
        <div
          className="shadow-simple absolute top-full -left-4 p-3 bg-white w-[230px] dark:bg-black-light
          rounded-lg border border-solid border-grey-light dark:border-none z-50"
          ref={modalRef}
        >
          <div className="flex justify-start">
            <Button
              onClick={copyTextToClipboard}
              size="sm"
              className="w-[70px] h-[30px] flex items-center justify-center text-xs shrink-0 mr-2"
            >
              링크 복사
            </Button>
            <Button
              onClick={downloadMap}
              size="sm"
              className="w-[70px] h-[30px] flex items-center justify-center text-xs shrink-0"
              disabled={downLoading}
            >
              {downLoading ? (
                <LoadingIcon className="m-0 text-white" size="sm" />
              ) : (
                "PDF 저장"
              )}
            </Button>
          </div>
          <div className="mt-1">
            <Text typography="t7">
              해당 위치를 기반으로 주변의 지도와 철봉 위치를 PDF로 저장할 수
              있습니다.
            </Text>
          </div>

          <button
            className="absolute top-2 right-2"
            onClick={() => setViewModal(false)}
          >
            <CloseIcon color="black" size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
