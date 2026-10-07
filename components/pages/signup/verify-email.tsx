import sendSignupCode from "@api/auth/send-signup-code";
import verifyCode from "@api/auth/verifyCode";
import BottomFixedButton from "@common/bottom-fixed-button";
import Button from "@common/button";
import GrowBox from "@common/grow-box";
import InputField from "@common/input-field";
import Section from "@common/section";
import Timer from "@common/timer";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import LoadingIcon from "@icons/loading-icon";
import { validateCode, validateEmail, validateMessage } from "@lib/validate";
import { FetchError } from "@lib/fetchData";
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
    if (emailLoading || completed.code) return;
    setTimerReset(false);

    setEmailLoading(true);

    try {
      await sendSignupCode(email.value);

      setViewCode(true);

      setCompleted((prev) => ({
        ...prev,
        email: true,
      }));

      setTimerReset(true);
    } catch (e) {
      if (e instanceof FetchError && e.status === 409) {
        setErrorMessage((prev) => ({
          ...prev,
          email: "이미 가입되어 있는 이메일입니다.",
        }));
      } else {
        setErrorMessage((prev) => ({
          ...prev,
          email: "잠시 후 다시 시도해주세요",
        }));
      }
    } finally {
      setEmailLoading(false);
    }
  };

  const verify = async () => {
    if (codeLoading || completed.code) return;
    setCodeLoading(true);

    try {
      await verifyCode({ email: email.value, code: code.value });

      setCompleted((prev) => ({
        ...prev,
        code: true,
      }));
    } catch (e) {
      if (e instanceof FetchError && e.status === 400) {
        setErrorMessage((prev) => ({
          ...prev,
          code: "유효하지 않은 인증 코드입니다.",
        }));
      } else {
        setErrorMessage((prev) => ({
          ...prev,
          code: "잠시 후 다시 시도해주세요.",
        }));
      }
    } finally {
      setCodeLoading(false);
    }
  };

  return (
    <Section className="flex h-full flex-col pb-0 pt-8">
      <div className="mb-5 rounded-2xl border border-primary/10 bg-search-input-bg/45 p-4 dark:border-grey-dark dark:bg-black/30">
        <Text typography="t6" display="block" className="leading-relaxed text-grey-dark dark:text-grey">
          이메일로 인증 코드를 보내 계정을 확인합니다.
        </Text>
      </div>
      <div className="mb-10">
        <InputField
          label="이메일"
          name="email"
          placeholder="pullup@pullup.com"
          type="email"
          autoComplete="email"
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
    errors.email = validateMessage.email;
  }

  if (!validateCode(values.code)) {
    errors.code = validateMessage.emailCode;
  }

  return errors;
};

export default VerifyEmail;
