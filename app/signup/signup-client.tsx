"use client";

import signup from "@api/auth/signup";
import BottomSheet from "@common/bottom-sheet";
import SideMain from "@common/side-main";
import EnterPassword from "@pages/signup/enter-password";
import EnterUsername from "@pages/signup/enter-username";
import SignupComplete, {
  type SignupStatus,
} from "@pages/signup/signup-complete";
import VerifyEmail from "@pages/signup/verify-email";
import TermsCheckboxForm from "@pages/terms/terms-checkbox-form";
import useAlertStore from "@store/useAlertStore";
import { useBottomSheetStore } from "@store/useBottomSheetStore";
import useTermsStore from "@store/useTermsStore";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { type Device } from "../mypage/page";

interface SignupClientProps {
  returnUrl?: string;
  referrer: boolean;
  deviceType?: Device;
}

const SignupClient = ({
  returnUrl,
  referrer,
  deviceType = "desktop",
}: SignupClientProps) => {
  const router = useRouter();
  const { setIsTermsAgreed, isTermsAgreed } = useTermsStore();
  const { show, hide } = useBottomSheetStore();

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
    show("terms-in");
    const images = ["/signup-loading.gif"];

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

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
        if (returnUrl) {
          router.replace(returnUrl);
        } else {
          router.back();
        }
      },
      cancel: true,
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

  if (!isTermsAgreed) {
    return (
      <SideMain
        headerTitle={headerTitle}
        prevClick={handlePrev}
        fullHeight
        hasBackButton={signupValue.step === 3 ? false : true}
        referrer={!!referrer}
        deviceType={deviceType}
      >
        <BottomSheet id="terms-in" title="약관 동의">
          <TermsCheckboxForm
            next={() => {
              hide();
              setIsTermsAgreed(true);
            }}
          />
        </BottomSheet>
      </SideMain>
    );
  }

  return (
    <SideMain
      headerTitle={headerTitle}
      prevClick={handlePrev}
      fullHeight
      hasBackButton={signupValue.step === 3 ? false : true}
      referrer={!!referrer}
      deviceType={deviceType}
      bodyStyle="pb-0"
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
