import { type Device } from "@/app/mypage/page";
import useAlertStore from "@/store/useAlertStore";
import type { Moment } from "@api/moment/get-moment-for-marker";
import postMoment from "@api/moment/post-moment";
import SideMain from "@common/side-main";
import useInput from "@hooks/useInput";
import ArrowLeftIcon from "@icons/arrow-left-icon";
import LoadingIcon from "@icons/loading-icon";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AddMomentPageProps {
  deviceType: Device;
  url: string;
  markerId: number;
  imageFile: File;
  clear: VoidFunction;
  addMoment: (moment: Moment) => void;
}

const AddMomentPage = ({
  deviceType,
  url,
  imageFile,
  markerId,
  clear,
  addMoment,
}: AddMomentPageProps) => {
  const textValue = useInput("");
  const router = useRouter();

  const { openAlert } = useAlertStore();

  const [loading, setLoading] = useState(false);

  const handleGenerateImage = async () => {
    setLoading(true);
    const data = {
      caption: textValue.value,
      markerId: markerId,
      photo: imageFile,
    };

    const res = await postMoment(data);

    if (!res.ok) {
      if (res.status === 401) {
        openAlert({
          title: "접근 권한이 없습니다.",
          description: "로그인 후 다시 시도해 주세요.",
          onClick: () => {
            router.push(`/signin?returnUrl=/pullup/${markerId}/moment`);
          },
          cancel: true,
        });
      } else {
        openAlert({
          title: "실패",
          description: "잠시 후 다시 시도해주세요.",
          cancel: true,
          onClick: () => {},
        });
      }
    } else {
      const data: Moment = await res.json();
      if (!data) return;
      addMoment(data);
      clear();
    }

    setLoading(false);
  };

  return (
    <SideMain fullHeight deviceType={deviceType} bodyStyle="p-0">
      <div className="w-full h-full bg-black">
        <div className="flex flex-col w-full h-full">
          <div className="flex items-center pl-2 pr-4 h-10">
            <button onClick={clear}>
              <ArrowLeftIcon className="fill-white" />
            </button>
          </div>

          <div className="relative pt-4 grow shrink flex flex-col items-center justify-center text-white">
            <div className="relative w-full h-3/4">
              <Image src={url} fill alt="" className="object-contain" />
            </div>
            <div className="w-full h-1/4 px-4 flex flex-col justify-center">
              <div className="text-white mb-2">내용</div>
              <input
                value={textValue.value}
                onChange={textValue.onChange}
                maxLength={30}
                className="w-full bg-grey-dark rounded-md  outline-none p-2"
                placeholder="오운완 🦾"
              />
            </div>
          </div>

          <div className="text-center">
            <button
              className="text-white p-2 h-10"
              disabled={loading}
              onClick={handleGenerateImage}
            >
              {loading ? <LoadingIcon className="m-0" size="sm" /> : "만들기"}
            </button>
          </div>
        </div>
      </div>
    </SideMain>
  );
};

export default AddMomentPage;
