import sendSignupCode from "@api/auth/send-signup-code";
import verifyCode from "@api/auth/verifyCode";
import BottomFixedButton from "@common/bottom-fixed-button";
import Button from "@common/button";
import GrowBox from "@common/grow-box";
import InputField from "@common/input-field";
import Section from "@common/section";
import Timer from "@common/timer";
import useInput from "@hooks/useInput";
import LoadingIcon from "@icons/loading-icon";
import { validateCode, validateEmail, validateMassage } from "@lib/validate";
import { useEffect, useState } from "react";

interface VerifyEmailProps {
  next: (value: string) => void;
}

const VerifyEmail = ({ next }: VerifyEmailProps) => {
  const email = useInput("");
  const code = useInput("");

  const [viewCode, setViewCode] = useState(false);

  const [viewError, setViewError] = useState<{
    email?: boolean;
    code?: boolean;
  }>({});

  const [completed, setCompleted] = useState<{ email: boolean; code: boolean }>(
    {
      email: false,
      code: false,
    }
  );

  const [emailLoading, setEmailLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);

  const [timerReset, setTimerReset] = useState(false);

  const [errorMessage, setErrorMessage] = useState(() =>
    validateSignupEmail({ email: email.value, code: code.value })
  );

  useEffect(() => {
    setErrorMessage(
      validateSignupEmail({ email: email.value, code: code.value })
    );
  }, [email.value, code.value]);

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    setViewError((prev) => ({
      ...prev,
      [e.target.name]: true,
    }));
  };

  const sendEmail = async () => {
    setTimerReset(false);

    setEmailLoading(true);

    const response = await sendSignupCode(email.value);

    if (!response.ok) {
      if (response.status === 409) {
        setErrorMessage((prev) => ({
          ...prev,
          email: "이미 가입되어 있는 이메일입니다.",
        }));

        setEmailLoading(false);
        return;
      }
      setErrorMessage((prev) => ({
        ...prev,
        email: "잠시 후 다시 시도해주세요",
      }));

      setEmailLoading(false);
      return;
    }

    setViewCode(true);

    setCompleted((prev) => ({
      ...prev,
      email: true,
    }));

    setEmailLoading(false);

    setTimerReset(true);
  };

  const verify = async () => {
    setCodeLoading(true);

    const response = await verifyCode({ email: email.value, code: code.value });

    if (!response.ok) {
      if (response.status === 400) {
        setErrorMessage((prev) => ({
          ...prev,
          code: "유효하지 않은 인증 코드입니다.",
        }));

        setCodeLoading(false);
        return;
      }

      setErrorMessage((prev) => ({
        ...prev,
        code: "잠시 후 다시 시도해주세요.",
      }));

      setCodeLoading(false);
      return;
    }

    setCompleted((prev) => ({
      ...prev,
      code: true,
    }));

    setCodeLoading(false);
  };

  return (
    <Section className="h-full pb-0 flex flex-col">
      <div className="mb-10">
        <InputField
          label="이메일"
          name="email"
          placeholder="pullup@pullup.com"
          value={email.value}
          onChange={email.onChange}
          onBlur={handleBlur}
          isError={viewError.email && !!errorMessage.email}
          message={viewError.email ? errorMessage.email : ""}
          disabled={completed.code}
        />
        <Button
          onClick={sendEmail}
          disabled={emailLoading || !!errorMessage.email || completed.code}
          size="sm"
          className="w-20 h-10 flex items-center justify-center"
        >
          {emailLoading ? (
            <LoadingIcon size="sm" className="mr-0" />
          ) : completed.email ? (
            "다시 요청"
          ) : (
            "인증 요청"
          )}
        </Button>
      </div>
      {viewCode && (
        <div>
          <InputField
            label="인증코드"
            name="code"
            value={code.value}
            onChange={(e) => {
              const inputValue = e.target.value;

              if (/^\d*$/.test(inputValue) && inputValue.length <= 6) {
                code.onChange(e);
              }
            }}
            onBlur={handleBlur}
            isError={viewError.code && !!errorMessage.code}
            message={viewError.code ? errorMessage.code : ""}
            disabled={completed.code}
          />
          <div className="flex items-center">
            <Button
              onClick={verify}
              disabled={codeLoading || !!errorMessage.code || completed.code}
              size="sm"
              className="w-20 h-10 flex items-center justify-center mr-6"
            >
              {codeLoading ? (
                <LoadingIcon size="sm" className="mr-0" />
              ) : completed.code ? (
                "인증 완료"
              ) : (
                "인증 확인"
              )}
            </Button>
            <Timer
              start={completed.email && !completed.code}
              reset={timerReset}
              count={300}
            />
          </div>
        </div>
      )}

      <GrowBox />

      <BottomFixedButton
        onClick={() => {
          next(email.value);
        }}
        disabled={!completed.email || !completed.code}
        containerStyle="px-0"
      >
        다음
      </BottomFixedButton>
    </Section>
  );
};

interface Errors {
  email?: string | null;
  code?: string | null;
}

const validateSignupEmail = (values: {
  email: string;
  code: string;
}): Errors => {
  let errors: Errors = {};

  if (!validateEmail(values.email)) {
    errors.email = validateMassage.email;
  }

  if (!validateCode(values.code)) {
    errors.code = validateMassage.emailCode;
  }

  return errors;
};

export default VerifyEmail;
