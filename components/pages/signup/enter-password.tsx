import Button from "@common/button";
import InputField from "@common/input-field";
import useInput from "@hooks/useInput";
import { validateMassage, validatePassword } from "@lib/validate";
import { useMemo, useState } from "react";

interface EnterPasswordProps {
  next: (value: string) => void;
}

const EnterPassword = ({ next }: EnterPasswordProps) => {
  const password = useInput("");

  const [viewError, setViewError] = useState(false);

  const errorMessage = useMemo(() => {
    if (!validatePassword(password.value)) {
      return validateMassage.password;
    }

    return null;
  }, [password.value]);

  const handleBlur = () => {
    setViewError(true);
  };

  return (
    <div>
      <InputField
        label="비밀번호"
        type="password"
        value={password.value}
        onChange={password.onChange}
        onBlur={handleBlur}
        isError={viewError && errorMessage !== null}
        message={viewError ? errorMessage : ""}
      />
      <Button
        onClick={() => {
          next(password.value);
        }}
        disabled={Boolean(errorMessage)}
      >
        다음
      </Button>
    </div>
  );
};

export default EnterPassword;
