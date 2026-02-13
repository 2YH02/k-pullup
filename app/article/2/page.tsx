import { type Device } from "@/app/mypage/page";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";
import ImageWrap from "./image-wrap";

const ArticleItemPage = () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <SideMain
      headerTitle="철봉 장점 및 주의사항"
      hasBackButton
      fullHeight
      deviceType={deviceType}
    >
      <Section>
        <div className="relative mb-4">
          <ImageWrap src={"/pullup3.jpg"} alt="상세" w={600} h={600} />
        </div>
        <div>
          <Text typography="t5">
            안녕하세요! 철봉 운동은 매우 간단하면서도 효과적인 운동입니다.
            철봉에 매달리기만 해도 다양한 신체 부위의 근력을 강화하고, 여러 가지
            건강상의 이점을 누릴 수 있습니다. 그럼 철봉 운동의 장점과 주의점에
            대해 자세히 알아보겠습니다.
          </Text>
        </div>

        <div className="h-0.5 w-full bg-grey-light dark:bg-grey-dark my-2" />

        <div>
          <Text
            typography="t4"
            fontWeight="bold"
            className="mb-2"
            display="block"
          >
            장점
          </Text>
          <div className="mb-1">
            <Text typography="t5" fontWeight="bold" display="block">
              - 악력 강화
            </Text>
            <Text typography="t5">
              철봉에 매달리면 손과 손가락의 힘이 길러져 일상생활에서 더 강한
              그립을 가질 수 있습니다. 특히, 무거운 물건을 들거나 잡는 동작에서
              도움이 됩니다.
            </Text>
          </div>
          <div className="mb-1">
            <Text typography="t5" fontWeight="bold" display="block">
              - 허리 통증 완화
            </Text>
            <Text typography="t5">
              허리를 자연스럽게 늘려주는 동작으로 척추를 건강하게 유지할 수
              있습니다. 허리에 부담이 적어 허리 통증을 줄이는 데 효과적입니다.
            </Text>
          </div>
          <div className="mb-1">
            <Text typography="t5" fontWeight="bold" display="block">
              - 상체 근육 발달
            </Text>
            <Text typography="t5">
              철봉 운동은 팔과 손의 힘을 주로 사용하여 상체 근육을 강화합니다.
              특히, 이두근과 삼두근의 발달에 큰 도움이 됩니다.
            </Text>
          </div>
          <div className="mb-1">
            <Text typography="t5" fontWeight="bold" display="block">
              - 등 근육 강화
            </Text>
            <Text typography="t5">
              철봉에 매달리면 자연스럽게 등 근육이 자극되어 등이 더
              튼튼해집니다. 등 근육 발달은 올바른 자세 유지와 체형 개선에 도움을
              줍니다.
            </Text>
          </div>
          <div className="mb-1">
            <Text typography="t5" fontWeight="bold" display="block">
              - 팔 근력 강화
            </Text>
            <Text typography="t5">
              팔의 근육을 집중적으로 사용하여 팔의 근력을 높여줍니다. 이는 다른
              운동이나 일상 활동에서의 성능 향상으로 이어질 수 있습니다.
            </Text>
          </div>
          <div className="mb-1">
            <Text typography="t5" fontWeight="bold" display="block">
              - 어깨 발달
            </Text>
            <Text typography="t5">
              철봉 운동은 어깨 넓이를 넓게 만들어 균형 잡힌 상체를 만듭니다.
              어깨 근육을 발달시키면 어깨의 안정성과 가동 범위가 개선됩니다.
            </Text>
          </div>
          <div className="mb-1">
            <Text typography="t5" fontWeight="bold" display="block">
              - 전신 근력 균형
            </Text>
            <Text typography="t5">
              철봉 운동은 팔, 등, 가슴, 복근 등 다양한 근육을 사용하여 전체적인
              근력 균형을 맞출 수 있습니다. 이는 전반적인 신체 균형과 운동 성능
              향상에 기여합니다.
            </Text>
          </div>
        </div>

        <div className="h-0.5 w-full bg-grey-light dark:bg-grey-dark my-2" />

        <div className="relative mb-4">
          <ImageWrap src={"/pullup1.jpg"} w={600} h={600} alt="상세" />
        </div>
        <div>
          <Text
            typography="t4"
            fontWeight="bold"
            className="mb-2"
            display="block"
          >
            철봉 운동 주의점
          </Text>
          <div className="mb-1">
            <Text typography="t5" fontWeight="bold" display="block">
              - 올바른 자세 유지
            </Text>
            <Text typography="t5">
              철봉에 매달릴 때는 몸을 곧게 펴고, 어깨를 내리지 않도록 주의해야
              합니다. 잘못된 자세로 운동하면 오히려 몸에 무리를 줄 수 있습니다.
            </Text>
          </div>
          <div className="mb-1">
            <Text typography="t5" fontWeight="bold" display="block">
              - 무리하지 않기
            </Text>
            <Text typography="t5">
              처음부터 많은 시간을 매달리려고 하지 말고, 점차 시간을 늘려가는
              것이 중요합니다. 갑작스런 과도한 운동은 근육에 손상을 줄 수
              있으므로 천천히 진행하세요.
            </Text>
          </div>
          <div className="mb-1">
            <Text typography="t5" fontWeight="bold" display="block">
              - 전신 사용
            </Text>
            <Text typography="t5">
              철봉 운동은 팔뿐만 아니라 가슴과 등 근육도 함께 사용하는 것이
              중요합니다. 팔만 사용하면 특정 근육만 발달하게 되어 균형이 깨질 수
              있습니다. 다양한 근육을 함께 사용하여 균형 잡힌 근력 발달을
              도모하세요.
            </Text>
          </div>
        </div>

        <div className="h-0.5 w-full bg-grey-light dark:bg-grey-dark my-2" />

        <Text typography="t5" className="mb-3">
          철봉 운동을 꾸준히 하면 상체 근력 발달과 통증 완화에 큰 도움이 됩니다.
          하지만 올바른 자세와 적절한 운동 강도를 유지하는 것이 중요합니다. 너무
          무리하지 말고, 천천히 몸을 익혀가며 운동하세요. 이렇게 철봉 운동의
          장점과 주의점을 이해하고 실천하면 더 건강하고 균형 잡힌 신체를 가질 수
          있을 것입니다.
        </Text>

        <div className="relative mb-4">
          <ImageWrap src={"/pullup2.jpg"} w={600} h={600} alt="상세" />
        </div>
      </Section>
    </SideMain>
  );
};

export default ArticleItemPage;
