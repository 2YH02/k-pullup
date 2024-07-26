"use client";

import Button from "@common/button";
import InputField from "@common/input-field";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import { validateSigin } from "@lib/validate";
import Link from "next/link";
import { useMemo, useState } from "react";

interface SigninValue {
  email: string;
  password: string;
}

const SigninForm = () => {
  const emailValue = useInput("");
  const passwordValue = useInput("");

  const [viewInputError, setViewInputError] = useState<Partial<SigninValue>>(
    {}
  );

  const errors = useMemo(() => {
    const formValues = {
      email: emailValue.value,
      password: passwordValue.value,
    };

    return validateSigin(formValues);
  }, [emailValue.value, passwordValue.value]);

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    setViewInputError((prev) => ({
      ...prev,
      [e.target.name]: "true",
    }));
  };

  const sigin = () => {
    const siginData = {
      email: emailValue.value,
      password: passwordValue.value,
    };

    const data = validateSigin(siginData);

    console.log(data);
  };

  const isAvailable = Object.keys(errors).length === 0;

  return (
    <div>
      <div>
        <InputField
          label="이메일"
          name="email"
          value={emailValue.value}
          isError={Boolean(viewInputError.email) && Boolean(errors.email)}
          message={Boolean(viewInputError.email) ? errors.email : ""}
          onChange={emailValue.handleChange}
          onBlur={handleBlur}
        />
        <InputField
          label="비밀번호"
          name="password"
          type="password"
          value={passwordValue.value}
          isError={Boolean(viewInputError.password) && Boolean(errors.password)}
          message={Boolean(viewInputError.password) ? errors.password : ""}
          onBlur={handleBlur}
          onChange={passwordValue.handleChange}
        />
      </div>
      <div>
        <Button onClick={sigin} disabled={!isAvailable}>
          로그인
        </Button>
      </div>
      <div className="mt-3">
        <div>
          <Text typography="t6" className="mr-1">
            계정이 없으신가요?
          </Text>
          <Link href="/signup">
            <Text typography="t6" className="text-grey-dark hover:underline">
              이메일로 회원가입 하기
            </Text>
          </Link>
        </div>

        <div>
          <Text typography="t6" className="mr-1">
            비밀번호를 잊어버리셨나요?
          </Text>
          <button>
            <Text typography="t6" className="text-grey-dark hover:underline">
              비밀번호 초기화하기
            </Text>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SigninForm;
