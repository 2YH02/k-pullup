"use client";

import LoadingIcon from "@/components/icons/loading-icon";
import resetPassword from "@api/auth/reset-password";
import signout from "@api/auth/signout";
import Button from "@common/button";
import InputField from "@common/input-field";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import { validateMassage, validatePassword } from "@lib/validate";
import useAlertStore from "@store/useAlertStore";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const ResetPasswordForm = ({ token }: { token: string }) => {
  const router = useRouter();

  const inputValue = useInput("");

  const { openAlert } = useAlertStore();

  const [viewError, setViewError] = useState(false);
  const [loading, setLoading] = useState(false);

  const errorMessage = useMemo(() => {
    if (!validatePassword(inputValue.value)) {
      return validateMassage.password;
    }

    return null;
  }, [inputValue.value]);

  const onSubmit = async () => {
    openAlert({
      title: "정말 초기화하시겠습니까?",
      onClick: async () => {
        setLoading(true);
        try {
          await resetPassword({
            password: inputValue.value,
            token,
          });

          try {
            await signout();
          } catch {
            // 로그아웃 실패는 흡수하고 로그인 페이지로 계속 진행한다.
          }

          router.replace("/signin");
          router.refresh();
        } catch {
          openAlert({
            title: "잠시 후 다시 시도해주세요",
            onClick: () => {},
          });
        } finally {
          setLoading(false);
        }
      },
      cancel: true,
    });
  };

  const handleBlur = () => {
    setViewError(true);
  };

  return (
    <div className="mt-4">
      <Text typography="t6" className="mb-2">
        원하시는 비밀번호를 입력해주세요
      </Text>
      <InputField
        type="password"
        value={inputValue.value}
        onChange={inputValue.onChange}
        onBlur={handleBlur}
        isError={viewError && errorMessage !== null}
        message={viewError ? errorMessage : ""}
      />
      <Button
        className="flex items-center justify-center w-20 h-10 p-0"
        onClick={onSubmit}
        disabled={Boolean(errorMessage) || loading}
      >
        {loading ? (
          <LoadingIcon size="sm" className="mr-0 ml-0 text-black" />
        ) : (
          "확인"
        )}
      </Button>
    </div>
  );
};

export default ResetPasswordForm;
