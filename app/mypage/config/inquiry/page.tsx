import ImageWrap from "@common/Image-wrap";
import Section from "@common/section";
import ShadowBox from "@common/shadow-box";
import SideMain from "@common/side-main";
import Text from "@common/text";
import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";
import { type Device } from "../../page";

const InquiryPage = () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);
  return (
    <SideMain
      headerTitle="문의"
      fullHeight
      hasBackButton
      deviceType={deviceType}
    >
      <Section>
        <ShadowBox className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
          <Text
            display="block"
            typography="t1"
            fontWeight="bold"
            textAlign="center"
          >
            대한민국 철봉 지도
          </Text>
          <Text display="block" typography="t6">
            안녕하세요. 운동을 좋아해 만들게 된 대한민국 철봉 지도입니다.
          </Text>
          <Text display="block" typography="t6">
            초기 데이터는{" "}
            <a
              href="https://chulbong.kr"
              target="_blank"
              className="font-semibold hover:underline text-primary"
            >
              chulbong.kr
            </a>
            사이트를 이용했으며, 이후에 해당 제작자분께 허락을 받았습니다.
          </Text>
          <Text display="block" typography="t6">
            더 나은 정보를 제공하기 위해 계속해서 업데이트하고 있으니, 많은
            관심과 이용 부탁드립니다.
          </Text>
          <Text display="block" typography="t6">
            문의 사항이 있으시면 언제든지
            <a
              href="mailto:chulbong.kr@gmail.com"
              className="text-primary font-semibold hover:underline"
            >
              chulbong.kr@gmail.com
            </a>
            에 연락해 주세요.
          </Text>

          <div>
            <div className="w-full h-[416px]">
              <ImageWrap
                src="/hand.gif"
                alt="운동"
                h={1000}
                w={300}
                className="m-0"
              />
            </div>
            <Text
              typography="t7"
              fontWeight="bold"
              display="block"
              textAlign="center"
            >
              제작자 입니다
            </Text>
          </div>
        </ShadowBox>
      </Section>
    </SideMain>
  );
};

export default InquiryPage;
