"use client";

import sendPasswordResetEmail from "@api/auth/send-password-reset-email";
import Button from "@common/button";
import InputField from "@common/input-field";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import { validateEmail, validateMessage } from "@lib/validate";
import useAlertStore from "@store/useAlertStore";
import { useMemo, useState } from "react";

const SendPasswordForm = () => {
  const inputValue = useInput("");

  const { openAlert } = useAlertStore();

  const [viewError, setViewError] = useState(false);
  const [loading, setLoading] = useState(false);

  const errorMessage = useMemo(() => {
    if (!validateEmail(inputValue.value)) {
      return validateMessage.email;
    }

    return null;
  }, [inputValue.value]);

  const onSubmit = async () => {
    if (loading || errorMessage) return;
    setLoading(true);
    try {
      await sendPasswordResetEmail(inputValue.value.trim());

      openAlert({
        title: "메일 전송 완료",
        description: "이메일을 확인한 후 비밀번호 초기화를 완료해주세요",
        onClick: () => {
          inputValue.resetValue();
          setViewError(false);
        },
      });
    } catch {
      openAlert({
        title: "정확한 정보를 입력해주세요",
        description: "이메일 정보를 다시 확인해주세요",
        onClick: () => {},
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = () => {
    setViewError(true);
  };

  return (
    <div className="mt-4">
      <div className="rounded-2xl border border-primary/10 bg-search-input-bg/45 p-4 dark:border-grey-dark dark:bg-black/30">
        <Text typography="t6" display="block" className="leading-relaxed text-grey-dark dark:text-grey">
          이메일로 비밀번호 초기화 링크를 보내드립니다.
        </Text>
      </div>
      <div className="mt-5">
        <Text typography="t6" display="block" className="mb-2 text-grey-dark dark:text-grey">
          가입한 이메일 주소
        </Text>
        <InputField
          label=""
          type="email"
          autoComplete="email"
          value={inputValue.value}
          onChange={inputValue.onChange}
          onBlur={handleBlur}
          isError={viewError && errorMessage !== null}
          message={viewError ? errorMessage : ""}
        />
        <Button onClick={onSubmit} disabled={Boolean(errorMessage) || loading} className="mt-2">
          {loading ? "전송 중..." : "메일 보내기"}
        </Button>
      </div>
    </div>
  );
};

export default SendPasswordForm;
