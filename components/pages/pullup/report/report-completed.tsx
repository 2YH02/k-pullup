import Button from "@common/button";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ReportCompleted = () => {
  const router = useRouter();

  return (
    <SideMain
      headerTitle="정보 수정 요청"
      className="flex flex-col"
      fullHeight
      hasBackButton
    >
      <Section className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-35">
          <Image
            src={"/congratulations.gif"}
            alt="요청 완료"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-full object-cover"
            priority={true}
          />
        </div>

        <Text typography="t4" fontWeight="bold">
          요청 완료
        </Text>
        <Text fontWeight="bold">정보를 제공해주셔서 감사합니다!</Text>

        <div className="mt-3">
          <Button
            onClick={() => {
              router.back();
            }}
            size="sm"
            variant="contrast"
            className="mr-3"
          >
            돌아가기
          </Button>
          <Button
            onClick={() => {
              router.push("/mypage/report");
            }}
            size="sm"
          >
            내 요청 목록
          </Button>
        </div>
      </Section>
    </SideMain>
  );
};

export default ReportCompleted;
