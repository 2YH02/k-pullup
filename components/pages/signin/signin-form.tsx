"use client";

import signin from "@api/auth/signin";
import myInfo from "@api/user/myInfo";
import Button from "@common/button";
import InputField from "@common/input-field";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import { useToast } from "@hooks/useToast";
import LoadingIcon from "@icons/loading-icon";
import { validateSigin } from "@lib/validate";
import useUserStore from "@store/useUserStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface SigninValue {
  email: string;
  password: string;
}

interface SinginFormProps {
  returnUrl?: string;
}

const SigninForm = ({ returnUrl }: SinginFormProps) => {
  const router = useRouter();

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
    const onSubmit = async () => {
      setLoading(true);
      const siginData = {
        email: emailValue.value,
        password: passwordValue.value,
      };

      const response = await signin(siginData);

      if (response.error) {
        errors.email = "이메일 혹은 비밀번호를 확인해주세요.";
        errors.password = "이메일 혹은 비밀번호를 확인해주세요.";

        setLoading(false);
        return;
      }

      const user = await myInfo();

      if (user.error || !user.userId || !user) {
        router.refresh();
        toast({ description: "잠시 후 다시 시도해주세요," });
        setLoading(false);
      }

      setUser(user);
      setLoading(false);
      if (returnUrl) {
        router.replace(returnUrl);
      } else {
        router.replace("/mypage");
      }
      router.refresh();
    };
    const isAvailable = Object.keys(errors).length === 0;
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (!isAvailable) return;
        onSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [errors]);

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    setViewInputError((prev) => ({
      ...prev,
      [e.target.name]: "true",
    }));
  };

  const onSubmit = async () => {
    setLoading(true);
    const siginData = {
      email: emailValue.value,
      password: passwordValue.value,
    };

    const response = await signin(siginData);

    if (response.error) {
      errors.email = "이메일 혹은 비밀번호를 확인해주세요.";
      errors.password = "이메일 혹은 비밀번호를 확인해주세요.";

      setLoading(false);
      return;
    }

    const user = await myInfo();

    if (user.error || !user.userId || !user) {
      router.refresh();
      toast({ description: "잠시 후 다시 시도해주세요," });
      setLoading(false);
    }

    setUser(user);
    setLoading(false);
    if (returnUrl) {
      router.replace(returnUrl);
    } else {
      router.replace("/mypage");
    }
    router.refresh();
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
          onClick={onSubmit}
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
          <Link href={returnUrl ? `/signup?returnUrl=${returnUrl}` : "/signup"}>
            <Text typography="t6" className="text-grey-dark hover:underline">
              이메일로 회원가입 하기
            </Text>
          </Link>
        </div>

        <div>
          <Text typography="t6" className="mr-1">
            비밀번호를 잊어버리셨나요?
          </Text>
          <Link href="/reset-password">
            <Text typography="t6" className="text-grey-dark hover:underline">
              비밀번호 초기화하기
            </Text>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SigninForm;
