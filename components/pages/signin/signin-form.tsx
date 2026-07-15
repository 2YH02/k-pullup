"use client";

import signin from "@api/auth/signin";
import BottomSheet from "@common/bottom-sheet";
import Button from "@common/button";
import InputField from "@common/input-field";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import { useToast } from "@hooks/useToast";
import LoadingIcon from "@icons/loading-icon";
import { FetchError } from "@lib/fetchData";
import { setSessionCache } from "@lib/session-cache";
import { validateSigin } from "@lib/validate";
import { useBottomSheetStore } from "@store/useBottomSheetStore";
import useTermsStore from "@store/useTermsStore";
import useUserStore from "@store/useUserStore";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import TermsCheckboxForm from "../terms/terms-checkbox-form";

interface SigninValue {
  email: string;
  password: string;
}

interface SinginFormProps {
  returnUrl?: string;
}

const SigninForm = ({ returnUrl }: SinginFormProps) => {
  const router = useRouter();
  const { show, hide } = useBottomSheetStore();
  const { setIsTermsAgreed } = useTermsStore();

  const { setUser } = useUserStore();
  const { toast } = useToast();

  const emailValue = useInput("");
  const passwordValue = useInput("");

  const [viewInputError, setViewInputError] = useState<Partial<SigninValue>>(
    {}
  );
  const [loading, setLoading] = useState(false);

  const errors = useMemo(() => {
    const formValues = {
      email: emailValue.value,
      password: passwordValue.value,
    };

    return validateSigin(formValues);
  }, [emailValue.value, passwordValue.value]);

  useEffect(() => {
    const images = [
      "/allCheckedIcon.svg",
      "/allCheckIcon.svg",
      "/checkedIcon.svg",
      "/checkIcon.svg",
    ];

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // 단일 submit 함수 (useCallback으로 안정화)
  const handleSubmit = useCallback(async () => {
    if (loading) return; // 이중 제출 방지
    setLoading(true);

    try {
      const response = await signin({
        email: emailValue.value,
        password: passwordValue.value,
      });

      // error 필드 → 인라인 에러 메시지 (Req 2.2)
      if (response.error) {
        errors.email = "이메일 혹은 비밀번호를 확인해주세요.";
        errors.password = "이메일 혹은 비밀번호를 확인해주세요.";
        setViewInputError({ email: "true", password: "true" });
        setLoading(false);
        return;
      }

      // user null 또는 userId 누락 → 토스트 (Req 2.3)
      if (!response.user || !response.user.userId) {
        toast({ description: "잠시 후 다시 시도해주세요." });
        setLoading(false);
        return;
      }

      // 성공: signin 응답의 user를 직접 store + cache 저장 (Req 2.1)
      setUser(response.user);
      setSessionCache(response.user);
      setLoading(false);

      // returnUrl 검증: /로 시작하고 //가 아닌 경우만 허용 (Req 3.6, 3.7)
      const targetUrl =
        returnUrl && returnUrl.startsWith("/") && !returnUrl.startsWith("//")
          ? returnUrl
          : "/";
      router.replace(targetUrl);
      router.refresh();
    } catch (error) {
      // FetchError: 로그인 실패(401/400)도 여기로 옴 (fetchData가 non-OK에서 throw)
      if (error instanceof FetchError) {
        if (error.status === 401 || error.status === 400) {
          // 잘못된 자격 증명 → 인라인 에러 메시지
          errors.email = "이메일 혹은 비밀번호를 확인해주세요.";
          errors.password = "이메일 혹은 비밀번호를 확인해주세요.";
          setViewInputError({ email: "true", password: "true" });
        } else {
          // 기타 서버/네트워크 에러
          toast({
            description:
              "네트워크 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
          });
        }
      } else {
        toast({ description: "잠시 후 다시 시도해주세요." });
      }
      setLoading(false);
    }
  }, [emailValue.value, passwordValue.value, loading, errors, router, returnUrl, setUser, toast]);

  // Enter 키 핸들러
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        const isAvailable = Object.keys(errors).length === 0;
        if (!isAvailable || loading) return;
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [errors, loading, handleSubmit]);

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    setViewInputError((prev) => ({
      ...prev,
      [e.target.name]: "true",
    }));
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
          onChange={emailValue.onChange}
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
          onChange={passwordValue.onChange}
        />
      </div>
      <div className="mt-3">
        <Button
          onClick={handleSubmit}
          disabled={!isAvailable || loading}
          className="flex items-center justify-center w-20 h-10 p-0 text-grey-dark disabled:text-grey-dark"
        >
          {loading ? <LoadingIcon size="sm" className="mr-0 ml-0" /> : "로그인"}
        </Button>
      </div>
      <div className="mt-3">
        <div>
          <Text typography="t6" className="mr-1">
            계정이 없으신가요?
          </Text>
          <button
            onClick={() => {
              show("terms");
            }}
          >
            <Text typography="t6" className="text-grey-dark hover:underline">
              이메일로 회원가입 하기
            </Text>
          </button>
        </div>

        <div>
          <Text typography="t6" className="mr-1">
            비밀번호를 잊어버리셨나요?
          </Text>
          <button onClick={() => router.push("/reset-password")}>
            <Text typography="t6" className="text-grey-dark hover:underline">
              비밀번호 초기화하기
            </Text>
          </button>
        </div>
      </div>

      <BottomSheet id="terms" title="약관 동의">
        <TermsCheckboxForm
          next={() => {
            setIsTermsAgreed(true);
            hide();
            const url = returnUrl
              ? `/signup?returnUrl=${returnUrl}`
              : "/signup";
            router.push(url);
          }}
        />
      </BottomSheet>
    </div>
  );
};

export default SigninForm;
