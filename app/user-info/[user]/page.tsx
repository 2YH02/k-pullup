import userMarkers from "@api/marker/user-marker";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import getServerDeviceType from "@lib/get-server-device-type";
import guardServerFetch from "@lib/server-fetch-guard";
import { cookies } from "next/headers";
import PageClient from "./page-client";

type Params = {
  user: string;
};

export const generateMetadata = ({ params }: { params: Params }) => {
  const userName = decodeURIComponent(params.user);

  return {
    title: `${userName}님의 등록 장소 | 대한민국 철봉 지도`,
    description: `${userName}님이 등록한 철봉 위치를 확인해보세요.`,
  };
};

const UserInfoPage = async ({ params }: { params: Params }) => {
  const { user } = params;

  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());
  const decodeUserName = decodeURIComponent(user);
  const deviceType = getServerDeviceType();

  const { status, data } = await guardServerFetch(() =>
    userMarkers({
      userName: decodeUserName,
      cookie: decodeCookie,
    })
  );

  const markerData = data ?? {
    markers: [],
    currentPage: 1,
    totalPages: 0,
    totalMarkers: 0,
  };

  return (
    <SideMain
      hasBackButton
      headerTitle="사용자 프로필"
      deviceType={deviceType}
      fullHeight
    >
      <Section className="pb-3 pt-5">
        <div className="rounded-2xl border border-primary/12 bg-search-input-bg/45 p-4 dark:border-white/10 dark:bg-black/30">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/12 text-lg font-bold text-primary-dark dark:bg-primary-dark/25 dark:text-primary-light">
              {decodeUserName.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <Text
                typography="t4"
                fontWeight="bold"
                display="block"
                className="wrap-break-word text-text-on-surface dark:text-grey-light"
              >
                {decodeUserName}
              </Text>
            </div>
          </div>

          <div className="mt-4 border-t border-primary/10 pt-3 dark:border-white/10">
            <Text typography="t7" className="text-grey-dark dark:text-grey">
              등록 수
            </Text>
            <Text
              typography="t4"
              fontWeight="bold"
              display="block"
              className="mt-0.5 text-primary dark:text-primary-light"
            >
              {markerData.totalMarkers}곳
            </Text>
          </div>
        </div>
      </Section>

      <Section className="pb-2 pt-2">
        <Text typography="t5" fontWeight="bold" className="text-text-on-surface dark:text-grey-light">
          등록 장소
        </Text>
        <Text typography="t7" display="block" className="mt-1 text-grey-dark dark:text-grey">
          지도에 추가한 철봉 위치
        </Text>
      </Section>

      <PageClient
        key={decodeUserName}
        data={markerData}
        userName={decodeUserName}
        loadFailed={status !== "ok"}
      />
    </SideMain>
  );
};

export default UserInfoPage;
