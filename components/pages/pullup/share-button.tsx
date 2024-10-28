"use client";

import Input from "@/components/common/input";
import convertWgs from "@api/marker/convert-wgs";
import Button from "@common/button";
import IconButton from "@common/icon-button";
import Text from "@common/text";
import useGps from "@hooks/useGps";
import { useToast } from "@hooks/useToast";
import CloseIcon from "@icons/close-icon";
import LoadingIcon from "@icons/loading-icon";
import downloadPdf from "@lib/api/marker/download-pdf";
import useAlertStore from "@store/useAlertStore";
import { Copy, ShareIcon } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  markerId: number;
  lat: number;
  lng: number;
  address: string;
}

const ShareButton = ({ markerId, lat, lng, address }: ShareButtonProps) => {
  const { openAlert, closeAlert } = useAlertStore();

  return (
    <div className="relative flex-1">
      <IconButton
        icon={<ShareIcon size={25} className="stroke-primary" />}
        text="공유 / 길찾기"
        className="w-full"
        onClick={() => {
          openAlert({
            contents: (
              <ShareContents
                markerId={markerId}
                lat={lat}
                lng={lng}
                address={address}
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
  address,
  closeAlert,
}: {
  markerId: number;
  lat: number;
  lng: number;
  address: string;
  closeAlert: VoidFunction;
}) => {
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
    <div>
      <div className="">
        <div className="flex justify-center mb-2">
          <Button
            onClick={copyTextToClipboard}
            size="sm"
            className="w-1/3 h-[30px] flex items-center justify-center text-xs shrink-0 mr-2"
          >
            링크 복사
          </Button>
          <Button
            onClick={copyAddress}
            size="sm"
            className="w-1/3 h-[30px] flex items-center justify-center text-xs shrink-0"
          >
            주소 복사
          </Button>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={openLocation}
            size="sm"
            className="w-1/3 h-[30px] flex items-center justify-center text-xs shrink-0 mr-2"
          >
            길찾기
          </Button>
          <Button
            onClick={downloadMap}
            size="sm"
            className="w-1/3 h-[30px] flex items-center justify-center text-xs shrink-0"
            disabled={downLoading}
          >
            {downLoading ? (
              <LoadingIcon className="m-0 text-white" size="sm" />
            ) : (
              "PDF 저장"
            )}
          </Button>
        </div>
      </div>
      <div className="mt-2">
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
