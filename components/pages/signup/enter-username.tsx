import Button from "@common/button";
import InputField from "@common/input-field";
import useInput from "@hooks/useInput";

interface EnterUsernameProps {
  next: (value: string) => void;
}

const EnterUsername = ({ next }: EnterUsernameProps) => {
  const username = useInput("");

  return (
    <div>
      <InputField
        label="사용자 이름"
        value={username.value}
        onChange={username.onChange}
      />
      <Button
        onClick={() => {
          next(username.value);
        }}
      >
        다음
      </Button>
    </div>
  );
};

export default EnterUsername;
