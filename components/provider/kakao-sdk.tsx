"use client";

import Script from "next/script";
import React from "react";

const KakaoSdk = () => {
  const handleLoad = () => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_APP_KEY);
    }
  };

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
