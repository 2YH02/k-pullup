import BottomFixedButton from "@common/bottom-fixed-button";
import GrowBox from "@common/grow-box";
import InputField from "@common/input-field";
import Section from "@common/section";
import Text from "@common/text";
import useInput from "@hooks/useInput";

interface EnterUsernameProps {
  next: (value: string) => void;
}

const EnterUsername = ({ next }: EnterUsernameProps) => {
  const username = useInput("");

  return (
    <Section className="flex h-full flex-col pb-0 pt-8">
      <div className="mb-5 rounded-2xl border border-primary/10 bg-search-input-bg/45 p-4 dark:border-grey-dark dark:bg-black/30">
        <Text typography="t6" display="block" className="leading-relaxed text-grey-dark dark:text-grey">
          커뮤니티에서 사용할 이름을 입력해 주세요.
        </Text>
      </div>
      <InputField
        label="사용자 이름"
        value={username.value}
        onChange={username.onChange}
        autoComplete="nickname"
      />

      <GrowBox />

      <BottomFixedButton
        onClick={() => {
          next(username.value.trim());
        }}
        containerStyle="px-0"
        disabled={username.value.length < 2}
      >
        다음
      </BottomFixedButton>
    </Section>
  );
};

export default EnterUsername;
