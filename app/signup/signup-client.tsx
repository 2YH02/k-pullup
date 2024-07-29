"use client";

import signup from "@api/auth/signup";
import SideMain from "@common/side-main";
import EnterPassword from "@pages/signup/enter-password";
import EnterUsername from "@pages/signup/enter-username";
import SignupComplete, {
  type SignupStatus,
} from "@pages/signup/signup-complete";
import VerifyEmail from "@pages/signup/verify-email";
import useAlertStore from "@store/useAlertStore";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface SignupClientProps {
  returnUrl?: string;
}

const SignupClient = ({ returnUrl }: SignupClientProps) => {
  const router = useRouter();

  const { openAlert } = useAlertStore();

  const [signupValue, setSignupValue] = useState({
    email: "",
    username: "",
    password: "",
    step: 0,
  });

  const [signupStatus, setSignupStatus] = useState<SignupStatus>("pending");

  const headerTitle = useMemo(() => {
    if (signupValue.step === 0) return "이메일 확인";
    if (signupValue.step === 1) return "사용자 이름 입력";
    if (signupValue.step === 2) return "비밀번호 입력";
  }, [signupValue.step]);

  useEffect(() => {
    const fetchSignup = async () => {
      const response = await signup({
        email: signupValue.email,
        username: signupValue.username,
        password: signupValue.password,
      });

      if (!response.ok) {
        setTimeout(() => {
          setSignupStatus("error");
        }, 1100);
        return;
      }

      setTimeout(() => {
        setSignupStatus("complete");
      }, 1100);
    };
    if (signupValue.step === 3) {
      fetchSignup();
    }
  }, [
    signupValue.step,
    signupValue.email,
    signupValue.username,
    signupValue.password,
  ]);

  const handlePrev = () => {
    openAlert({
      title: "회원가입 취소",
      description: "정말 회원가입을 취소 하시겠습니까?",
      onClick: () => {
        router.push("/signin");
      },
    });
  };

  const handleEmailChange = (email: string) => {
    setSignupValue((prev) => ({
      ...prev,
      email,
      step: prev.step + 1,
    }));
  };

  const handleUserNameChange = (username: string) => {
    setSignupValue((prev) => ({
      ...prev,
      username,
      step: prev.step + 1,
    }));
  };

  const handlePasswordChange = async (password: string) => {
    setSignupValue((prev) => ({
      ...prev,
      password,
      step: prev.step + 1,
    }));
  };

  return (
    <SideMain
      headerTitle={headerTitle}
      prevClick={handlePrev}
      fullHeight
      hasBackButton={signupValue.step === 3 ? false : true}
    >
      {signupValue.step === 0 && <VerifyEmail next={handleEmailChange} />}
      {signupValue.step === 1 && <EnterUsername next={handleUserNameChange} />}
      {signupValue.step === 2 && <EnterPassword next={handlePasswordChange} />}
      {signupValue.step === 3 && (
        <SignupComplete status={signupStatus} returnUrl={returnUrl} />
      )}
    </SideMain>
  );
};

export default SignupClient;
