"use client";

import sendPasswordResetEmail from "@api/auth/send-password-reset-email";
import Button from "@common/button";
import InputField from "@common/input-field";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import { validateEmail, validateMassage } from "@lib/validate";
import useAlertStore from "@store/useAlertStore";
import { useMemo, useState } from "react";

const SendPasswordForm = () => {
  const inputValue = useInput("");

  const { openAlert } = useAlertStore();

  const [viewError, setViewError] = useState(false);

  const errorMessage = useMemo(() => {
    if (!validateEmail(inputValue.value)) {
      return validateMassage.email;
    }

    return null;
  }, [inputValue.value]);

  const onSubmit = async () => {
    const response = await sendPasswordResetEmail(inputValue.value);

    if (!response.ok) {
      openAlert({
        title: "정확한 정보를 입력해주세요",
        description: "이메일 정보를 다시 확인해주세요",
        onClick: () => {},
      });
    } else {
      openAlert({
        title: "메일 전송 완료",
        description: "이메일을 확인한 후 비밀번호 초기화를 완료해주세요",
        onClick: () => {
          inputValue.resetValue();
          setViewError(false);
        },
      });
    }
  };

  const handleBlur = () => {
    setViewError(true);
  };

  return (
    <div className="mt-4">
      <Text typography="t6" className="mb-2">
        이메일로 비밀번호 초기화 링크를 발송해드립니다.
      </Text>
      <InputField
        value={inputValue.value}
        onChange={inputValue.handleChange}
        onBlur={handleBlur}
        isError={viewError && errorMessage !== null}
        message={viewError ? errorMessage : ""}
      />
      <Button onClick={onSubmit} disabled={Boolean(errorMessage)}>
        확인
      </Button>
    </div>
  );
};

export default SendPasswordForm;
