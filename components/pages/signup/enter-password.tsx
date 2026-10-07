import BottomFixedButton from "@common/bottom-fixed-button";
import GrowBox from "@common/grow-box";
import InputField from "@common/input-field";
import Section from "@common/section";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import { validateMessage, validatePassword } from "@lib/validate";
import { useEffect, useState } from "react";

interface EnterPasswordProps {
  next: (value: string) => void;
}

const EnterPassword = ({ next }: EnterPasswordProps) => {
  const password = useInput("");
  const confirm = useInput("");

  const [viewError, setViewError] = useState<{
    password?: boolean;
    confirm?: boolean;
  }>({});

  const [errorMessage, setErrorMessage] = useState(() =>
    validateSignupPassword({ password: password.value, confirm: confirm.value })
  );

  useEffect(() => {
    setErrorMessage(
      validateSignupPassword({
        password: password.value,
        confirm: confirm.value,
      })
    );
  }, [password.value, confirm.value]);

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    setViewError((prev) => ({
      ...prev,
      [e.target.name]: true,
    }));
  };
  return (
    <Section className="flex h-full flex-col pb-0 pt-8">
      <div className="mb-5 rounded-2xl border border-primary/10 bg-search-input-bg/45 p-4 dark:border-grey-dark dark:bg-black/30">
        <Text typography="t6" display="block" className="leading-relaxed text-grey-dark dark:text-grey">
          영문과 숫자를 포함한 8자 이상의 비밀번호를 설정해 주세요.
        </Text>
      </div>
      <InputField
        label="비밀번호"
        type="password"
        name="password"
        value={password.value}
        autoComplete="new-password"
        onChange={password.onChange}
        onBlur={handleBlur}
        isError={viewError.password && !!errorMessage.password}
        message={viewError.password ? errorMessage.password : ""}
      />
      <InputField
        label="비밀번호 확인"
        type="password"
        name="confirm"
        value={confirm.value}
        autoComplete="new-password"
        onChange={confirm.onChange}
        onBlur={handleBlur}
        isError={viewError.confirm && !!errorMessage.confirm}
        message={viewError.confirm ? errorMessage.confirm : ""}
      />

      <GrowBox />

      <BottomFixedButton
        onClick={() => {
          next(password.value);
        }}
        disabled={!!errorMessage.confirm || !!errorMessage.password}
        containerStyle="px-0"
      >
        회원가입
      </BottomFixedButton>
    </Section>
  );
};

interface Errors {
  password?: string | null;
  confirm?: string | null;
}

const validateSignupPassword = (values: {
  password: string;
  confirm: string;
}): Errors => {
  let errors: Errors = {};

  if (values.password !== values.confirm) {
    errors.confirm = "비밀번호가 일치하지 않습니다.";
  }

  if (!validatePassword(values.password)) {
    errors.password = validateMessage.password;
  }

  if (!validatePassword(values.confirm)) {
    errors.confirm = validateMessage.password;
  }

  return errors;
};

export default EnterPassword;
