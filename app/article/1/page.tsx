import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import YoutubePlayer from "@common/youtube-player";

const ArticleItemPage = () => {
  return (
    <SideMain headerTitle="철봉 가이드" hasBackButton fullHeight>
      <Section>
        <div className="mb-4">
          <YoutubePlayer url="https://www.youtube.com/watch?v=eGo4IYlbE5g" />
        </div>
        <Text typography="t5" className="mb-2">
          이 영상은 &apos;완벽한 풀업&apos;을 위한 가장 효과적인 방법을
          알려줍니다.
        </Text>
        <Text typography="t5" className="mb-2">
          운동을 하는 동안 자세한 동작 설명과 함께 흔히 하는 실수들을 경고하고
          올바른 자세와 운동 방법을 안내합니다.
        </Text>
        <Text typography="t5" className="mb-2">
          최대 가동 범위로 움직이고 반동 없이 근력을 사용해야 하며, 팔의 너비에
          따라 그립을 선택하여 적절한 자세를 유지해야 합니다.
        </Text>
        <Text typography="t5" className="mb-2">
          또한, 등 근육을 올바르게 사용하고 견갑골을 움직여야 효과적인 풀업을 할
          수 있습니다.
        </Text>
        <Text typography="t5" className="mb-2">
          마지막으로, 목표에 따라 자세와 다리의 위치를 조정할 수 있습니다.
        </Text>
      </Section>
    </SideMain>
  );
};

export default ArticleItemPage;
