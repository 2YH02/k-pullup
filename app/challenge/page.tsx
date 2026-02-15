import type { Device } from "@/app/mypage/page";
import Ads from "@/components/common/ads";
import SideMain from "@common/side-main";
import getDeviceType from "@lib/get-device-type";
import { Flag, Home } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export const generateMetadata = () => {
  return {
    title: "챌린지 - 대한민국 철봉 지도",
    description: "챌린지 기능을 준비하고 있습니다.",
  };
};

const ChallengePage = () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <SideMain headerTitle="챌린지" withNav fullHeight deviceType={deviceType}>
      <div className="page-transition">
        <section className="flex min-h-full items-center justify-center px-6 py-10">
          <div className="w-full max-w-md rounded-3xl border border-primary/14 bg-side-main p-6 text-center dark:border-white/12 dark:bg-black/30">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/18 bg-primary/8">
              <Flag size={24} className="text-primary dark:text-primary-light" />
            </div>
            <h1 className="text-xl font-bold text-text-on-surface dark:text-white">
              챌린지 준비 중
            </h1>
            <p className="mt-2 text-sm leading-6 text-text-on-surface-muted dark:text-grey-light">
              더 재미있는 기능으로 돌아올게요.
              <br />
              조금만 기다려 주세요.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-full border border-primary/18 px-4 text-sm font-medium text-text-on-surface transition-colors web:hover:bg-primary/8 active:bg-primary/12 dark:text-grey-light dark:web:hover:bg-white/8"
            >
              <Home size={16} />
              홈으로 이동
            </Link>
          </div>
        </section>
        <Ads type="square" />
      </div>
    </SideMain>
  );
};

export default ChallengePage;
