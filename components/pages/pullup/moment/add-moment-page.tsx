import { type Device } from "@/app/mypage/page";
import useAlertStore from "@/store/useAlertStore";
import type { Moment } from "@api/moment/get-moment-for-marker";
import postMoment from "@api/moment/post-moment";
import SideMain from "@common/side-main";
import useInput from "@hooks/useInput";
import LoadingIcon from "@icons/loading-icon";
import { FetchError } from "@lib/fetchData";
import { ChevronLeft, SendHorizontal } from "lucide-react";
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

    try {
      const res = await postMoment(data);

      const moment: Moment = await res.json();
      if (!moment) return;
      addMoment(moment);
      clear();
    } catch (e) {
      if (e instanceof FetchError && e.status === 401) {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <SideMain fullHeight deviceType={deviceType} bodyStyle="p-0">
      <div className="w-full h-full bg-black">
        <div className="flex flex-col w-full h-full">
          <div className="flex h-12 items-center px-3">
            <button
              onClick={clear}
              className="rounded-full p-1.5 text-white transition-colors duration-150 active:scale-[0.96] active:bg-white/15 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/70"
              aria-label="작성 취소"
            >
              <ChevronLeft size={22} strokeWidth={2.2} />
            </button>
          </div>

          <div className="relative grow shrink pt-2 text-white">
            <div className="relative h-[68%] w-full overflow-hidden rounded-md">
              <Image src={url} fill alt="" className="object-contain" />
            </div>
            <div className="flex h-[32%] w-full flex-col justify-center px-4">
              <div className="mb-2 text-[13px] text-white/85">내용</div>
              <input
                value={textValue.value}
                onChange={textValue.onChange}
                maxLength={30}
                className="w-full rounded-lg border border-white/25 bg-white/12 p-2 text-white placeholder:text-white/55 outline-hidden transition-colors duration-150 focus:border-white/45"
                placeholder="오운완 🦾"
              />
              <div className="mt-1 text-right text-[11px] text-white/60">
                {textValue.value.length}/30
              </div>
            </div>
          </div>

          <div className="px-4 pb-3 pt-1">
            <button
              className="flex h-10 w-full items-center justify-center gap-1.5 rounded-md border border-white/35 bg-white/12 text-white transition-[transform,background-color] duration-150 active:scale-[0.98] active:bg-white/20 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-not-allowed disabled:opacity-55"
              disabled={loading}
              onClick={handleGenerateImage}
            >
              {loading ? (
                <LoadingIcon className="m-0" size="sm" />
              ) : (
                <>
                  <SendHorizontal size={15} strokeWidth={2.2} />
                  만들기
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </SideMain>
  );
};

export default AddMomentPage;
