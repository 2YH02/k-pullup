"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

const GoogleAdsense = () => {
  const pathname = usePathname();

  if (pathname === "/admin") return null;
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.NEXT_PUBLIC_GOOGLE_AD_CID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
};

export default GoogleAdsense;
