import KakaoMap from "@layout/kakao-map";
import Roadview from "@layout/roadview";
import AlertProvider from "@provider/alert-provider";
import ChatIdProvider from "@provider/chat-Id-provider";
import GeoProvider from "@provider/geo-provider";
import GoogleAdsense from "@provider/google-adsense";
import GoogleAnalytics from "@provider/google-analytics";
import ImageModalProvider from "@provider/image-modal-provider";
import KakaoSdk from "@provider/kakao-sdk";
import LoadMarker from "@provider/load-marker";
import ThemeProvider from "@provider/theme-provider";
import { Toaster } from "@provider/toaster";
import UserProvider from "@provider/user-provider";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

declare global {
  interface Window {
    kakao: any;
    Kakao: any;
    adsbygoogle: any;
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

const pretendard = localFont({
  src: [
    {
      path: "./assets/Pretendard-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "./assets/Pretendard-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./assets/Pretendard-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./assets/Pretendard-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "./assets/Pretendard-ExtraBold.woff",
      weight: "800",
      style: "normal",
    },
  ],
});

const description =
  "내 주변 철봉을 찾고, 직접 위치를 등록해보세요. 전국 공원 철봉 위치를 한눈에.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.k-pullup.com"),
  title: "대한민국 철봉 지도",
  keywords: "철봉지도,위치등록,철봉정보,채팅,위치검색,관리,철봉찾기",
  description,
  openGraph: {
    type: "website",
    siteName: "대한민국 철봉 지도",
    url: "https://www.k-pullup.com",
    title: "대한민국 철봉 지도",
    description,
    images: "/metaimg.webp",
  },
  twitter: {
    card: "summary_large_image",
    title: "대한민국 철봉 지도",
    description,
    images: "/metaimg.webp",
  },
  verification: {
    google: "xsTAtA1ny-_9QoSKUsxC7zk_LljW5KBbcWULaNl2gt8",
    other: { naver: "d1ba940a668490789711101918c8b1f7e221a178" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={pretendard.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "대한민국 철봉 지도",
              url: "https://www.k-pullup.com",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://www.k-pullup.com/search?addr={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <KakaoSdk />
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        ) : null}
        <GoogleAdsense />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ChatIdProvider>
            <AlertProvider>
              <ImageModalProvider>
                <UserProvider>
                  <LoadMarker />
                  <GeoProvider>{children}</GeoProvider>
                  <Roadview />
                  <Toaster />
                </UserProvider>
              </ImageModalProvider>
            </AlertProvider>
            <KakaoMap />
          </ChatIdProvider>
        </ThemeProvider>
        <div id="portal"></div>
        <div id="image-portal"></div>
      </body>
    </html>
  );
}
