"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

const KakaoSdk = () => {
  const pathname = usePathname();

  const handleLoad = () => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_APP_KEY);
    }
  };

  if (pathname === "/admin") return null;

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
      integrity={process.env.NEXT_PUBLIC_REST_INTEGRITY_VALUE}
      crossOrigin="anonymous"
      onLoad={handleLoad}
    />
  );
};

export default KakaoSdk;
