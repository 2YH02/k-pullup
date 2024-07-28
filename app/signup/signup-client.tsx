"use client";

import Section from "@common/section";
import SideMain from "@common/side-main";
import EnterPassword from "@pages/signup/enter-password";
import EnterUsername from "@pages/signup/enter-username";
import VerifyEmail from "@pages/signup/verify-email";
import useAlertStore from "@store/useAlertStore";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const SignupClient = () => {
  const router = useRouter();

  const { openAlert } = useAlertStore();

  const [signinValue, setSigninValue] = useState({
    email: "",
    username: "",
    password: "",
    step: 0,
  });

  const headerTitle = useMemo(() => {
    if (signinValue.step === 0) return "이메일 확인";
    if (signinValue.step === 1) return "사용자 이름 입력";
    if (signinValue.step === 2) return "비밀번호 입력";
  }, [signinValue.step]);

  useEffect(() => {
    if (signinValue.step === 3) {
      console.log(signinValue);
    }
  }, [signinValue.step]);

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
    setSigninValue((prev) => ({
      ...prev,
      email,
      step: prev.step + 1,
    }));
  };
  const handleUserNameChange = (username: string) => {
    setSigninValue((prev) => ({
      ...prev,
      username,
      step: prev.step + 1,
    }));
  };
  const handlePasswordChange = (password: string) => {
    setSigninValue((prev) => ({
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
      hasBackButton={signinValue.step === 3 ? false : true}
    >
      <Section className="h-full pb-0">
        {signinValue.step === 0 && <VerifyEmail next={handleEmailChange} />}
        {signinValue.step === 1 && (
          <EnterUsername next={handleUserNameChange} />
        )}
        {signinValue.step === 2 && (
          <EnterPassword next={handlePasswordChange} />
        )}
      </Section>
    </SideMain>
  );
};

export default SignupClient;
