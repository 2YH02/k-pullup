import Button from "@common/button";
import Section from "@common/section";
import Text from "@common/text";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface FacilitiesCompleteProps {
  returnUrl: string;
}

const FacilitiesComplete = ({ returnUrl }: FacilitiesCompleteProps) => {
  const router = useRouter();
  return (
    <Section className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-35">
        <Image
          src="/signup-loading.gif"
          alt="기구 등록 로딩"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full object-cover"
          priority={true}
        />
      </div>
      <Text typography="t4" fontWeight="bold" className="mt-10">
        정보를 등록해주셔서 감사합니다!!
      </Text>

      <div className="flex items-center justify-center mt-3">
        <Button
          onClick={() => {
            router.replace("/");
          }}
          variant="contrast"
          className="mr-5"
          size="sm"
        >
          홈으로
        </Button>
        <Button
          onClick={() => {
            router.replace(returnUrl || "/");
          }}
          size="sm"
        >
          위치 상세보기
        </Button>
      </div>
    </Section>
  );
};

export default FacilitiesComplete;
