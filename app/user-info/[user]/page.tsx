import userMarkers from "@api/marker/user-marker";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import { cookies } from "next/headers";
import PageClient from "./page-client";

type Params = {
  user: string;
};

const UserInfoPage = async ({ params }: { params: Params }) => {
  const { user } = params;

  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());
  const decodeUserName = decodeURIComponent(user);

  const data = await userMarkers({
    userName: decodeUserName,
    cookie: decodeCookie,
  });

  return (
    <SideMain hasBackButton headerTitle="대한민국 철봉 지도">
      <Section>
        <div>
          <Text typography="t4" fontWeight="bold" className="mr-1">
            {decodeUserName}
          </Text>
        </div>
        <Text typography="t6">님이 등록한 위치</Text>
      </Section>

      <PageClient data={data} userName={decodeUserName} />
    </SideMain>
  );
};

export default UserInfoPage;
