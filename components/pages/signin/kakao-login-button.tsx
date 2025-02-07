"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KakaoLoginButton = () => {
  const [isWebView, setIsWebView] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ReactNativeWebView) {
      setIsWebView(true);
    }
  }, []);

  if (isWebView) {
    return (
      <button
        className="w-[90%] min-w-[300px] h-12 rounded-lg bg-[#FFDB6D] flex items-center justify-center
         web:text-lg mb-4"
        onClick={() => window.ReactNativeWebView?.postMessage("kakao-login")}
      >
        <div className="absolute left-10 flex items-center justify-center w-12 h-12 shrink-0">
          <img src="/kakao-logo.svg" alt="카카오 로고" className="" />
        </div>
        <div className="w-full text-center text-[#3D1200]">카카오 로그인</div>
      </button>
    );
  }

  return (
    <Link
      href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/kakao`}
      className="w-[90%] min-w-[300px] h-12 rounded-lg bg-[#FFDB6D] flex items-center justify-center
        web:text-lg mb-4"
    >
      <div className="absolute left-10 flex items-center justify-center w-12 h-12 shrink-0">
        <img src="/kakao-logo.svg" alt="카카오 로고" className="" />
      </div>
      <div className="w-full text-center text-[#3D1200]">카카오 로그인</div>
    </Link>
  );
};

export default KakaoLoginButton;
