import ImageWrap from "@common/image-wrap";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import getServerDeviceType from "@lib/get-server-device-type";
import { ExternalLink, Mail } from "lucide-react";

const InquiryPage = () => {
  const deviceType = getServerDeviceType();
  return (
    <SideMain
      headerTitle="문의"
      fullHeight
      hasBackButton
      deviceType={deviceType}
      className="select-auto"
    >
      <Section className="space-y-3 pb-6 pt-5">
        <div className="rounded-2xl border border-primary/12 bg-search-input-bg/45 p-4 dark:border-white/10 dark:bg-black/30">
          <Text typography="t7" display="block" className="text-grey-dark dark:text-grey">
            서비스 안내
          </Text>
          <Text typography="t4" fontWeight="bold" display="block" className="mt-0.5 text-primary dark:text-primary-light">
            대한민국 철봉 지도
          </Text>
          <Text typography="t6" display="block" className="mt-2 leading-relaxed text-grey-dark dark:text-grey">
            가까운 철봉을 찾고 함께 정보를 나눌 수 있도록 운영하고 있습니다.
          </Text>
        </div>

        <a
          href="mailto:support@k-pullup.com"
          className="group flex items-center gap-3 rounded-xl border border-primary/10 bg-search-input-bg/50 p-3 transition-[transform,background-color,border-color] duration-180 ease-out web:hover:border-primary/20 web:hover:bg-search-input-bg active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 motion-reduce:transform-none motion-reduce:transition-none dark:border-grey-dark dark:bg-black/35 dark:web:hover:bg-black/45"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light">
            <Mail size={19} />
          </span>
          <span className="min-w-0">
            <Text fontWeight="bold" display="block">이메일 문의</Text>
            <Text typography="t7" display="block" className="wrap-break-word text-grey-dark dark:text-grey">
              support@k-pullup.com
            </Text>
          </span>
        </a>

        <div className="rounded-xl border border-primary/10 bg-search-input-bg/50 p-4 dark:border-grey-dark dark:bg-black/35">
          <Text fontWeight="bold" display="block" className="mb-2 text-primary dark:text-primary-light">
            데이터 출처
          </Text>
          <Text typography="t6" display="block" className="leading-relaxed text-grey-dark dark:text-grey">
            초기 철봉 데이터는 제작자의 허락을 받아 chulbong.kr의 정보를 활용했습니다.
          </Text>
          <a
            href="https://chulbong.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 web:hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 dark:text-primary-light"
          >
            chulbong.kr 방문
            <ExternalLink size={14} />
          </a>
        </div>

        <div className="overflow-hidden rounded-xl border border-primary/10 bg-search-input-bg/35 p-3 dark:border-grey-dark dark:bg-black/25">
            <div className="mx-auto h-44 max-w-64 overflow-hidden rounded-lg">
              <ImageWrap
                src="/hand.gif"
                alt="철봉 운동을 소개하는 제작자"
                h={1000}
                w={300}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <Text
              typography="t7"
              display="block"
              textAlign="center"
              className="mt-2 text-grey-dark dark:text-grey"
            >
              운동을 좋아하는 개발자가 운영합니다.
            </Text>
        </div>
      </Section>
    </SideMain>
  );
};

export default InquiryPage;
