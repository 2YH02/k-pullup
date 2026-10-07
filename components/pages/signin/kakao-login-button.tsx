"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
        type="button"
        className="relative mb-3 flex h-12 w-full max-w-sm items-center justify-center rounded-xl bg-[#FFDB6D] text-[#3D1200] transition-transform duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 motion-reduce:transition-none"
        onClick={() => window.ReactNativeWebView?.postMessage("kakao-login")}
      >
        <div className="absolute left-10 flex shrink-0 items-center justify-center">
          <Image src="/kakao-logo.svg" alt="카카오 로고" width={36} height={36} />
        </div>
        <span className="w-full text-center">카카오 로그인</span>
      </button>
    );
  }

  return (
    <Link
      href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/kakao`}
      className="relative mb-3 flex h-12 w-full max-w-sm items-center justify-center rounded-xl bg-[#FFDB6D] text-[#3D1200] transition-transform duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 motion-reduce:transition-none"
    >
      <div className="absolute left-10 flex shrink-0 items-center justify-center">
        <Image src="/kakao-logo.svg" alt="카카오 로고" width={36} height={36} />
      </div>
      <span className="w-full text-center">카카오 로그인</span>
    </Link>
  );
};

export default KakaoLoginButton;
