"use client";

import Button from "@common/button";
import IconButton from "@common/icon-button";
import Text from "@common/text";
import { useToast } from "@hooks/useToast";
import CloseIcon from "@icons/close-icon";
import LoadingIcon from "@icons/loading-icon";
import downloadPdf from "@lib/api/marker/download-pdf";
import useAlertStore from "@store/useAlertStore";
import { ShareIcon } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  markerId: number;
  lat: number;
  lng: number;
}

const ShareButton = ({ markerId, lat, lng }: ShareButtonProps) => {
  const { openAlert, closeAlert } = useAlertStore();

  return (
    <div className="relative flex-1">
      <IconButton
        icon={<ShareIcon size={25} className="stroke-primary" />}
        text="공유"
        className="w-full"
        onClick={() => {
          openAlert({
            contents: (
              <ShareContents
                markerId={markerId}
                lat={lat}
                lng={lng}
                closeAlert={() => {
                  closeAlert();
                }}
              />
            ),
          });
        }}
      />
    </div>
  );
};

export default ShareButton;

const ShareContents = ({
  markerId,
  lat,
  lng,
  closeAlert,
}: {
  markerId: number;
  lat: number;
  lng: number;
  closeAlert: VoidFunction;
}) => {
  const { toast } = useToast();

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

  return (
    <div>
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

      <button className="absolute top-2 right-2" onClick={closeAlert}>
        <CloseIcon color="black" size={20} />
      </button>
    </div>
  );
};
