import BottomFixedButton from "@common/bottom-fixed-button";
import GrowBox from "@common/grow-box";
import InputField from "@common/input-field";
import Section from "@common/section";
import useInput from "@hooks/useInput";

interface EnterUsernameProps {
  next: (value: string) => void;
}

const EnterUsername = ({ next }: EnterUsernameProps) => {
  const username = useInput("");

  return (
    <Section className="h-full pb-0 flex flex-col">
      <InputField
        label="사용자 이름"
        value={username.value}
        onChange={username.onChange}
      />

      <GrowBox />

      <BottomFixedButton
        onClick={() => {
          next(username.value);
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
