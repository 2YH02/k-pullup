import BottomFixedButton from "@common/bottom-fixed-button";
import GrowBox from "@common/grow-box";
import Section from "@common/section";
import Text from "@common/text";
import useInput from "@hooks/useInput";
// TODO: textarea 공통 컴포넌트로 적용

interface SetDescriptionProps {
  next: (description?: string | null) => void;
}

const SetDescription = ({ next }: SetDescriptionProps) => {
  const description = useInput("");

  return (
    <Section className="h-full pb-0 flex flex-col">
      <div className="my-5">
        <Text fontWeight="bold">정확한 설명을 등록해 주시면,</Text>
        <Text fontWeight="bold">
          다른 사람이 해당 위치를 찾는 데 큰 도움이 됩니다!
        </Text>
      </div>
      <div>
        <textarea
          className="border border-primary bg-white dark:bg-black dark:text-white text-black w-full p-2 rounded resize-none focus:outline-none"
          maxLength={40}
          rows={4}
          placeholder="해당 위치에 대한 설명을 40자 이내로 작성해주세요."
          value={description.value}
          onChange={description.onChange}
        ></textarea>
      </div>
      <GrowBox />

      <BottomFixedButton
        onClick={() => {
          next(description.value === "" ? null : description.value);
        }}
        containerStyle="px-0"
      >
        {description.value === "" ? "설명 없이 위치 생성하기" : "위치 생성하기"}
      </BottomFixedButton>
    </Section>
  );
};

export default SetDescription;
