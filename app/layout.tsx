import KakaoMap from "@layout/kakao-map";
import Roadview from "@layout/roadview";
import AlertProvider from "@provider/alert-provider";
import ChatIdProvider from "@provider/chat-Id-provider";
import GeoProvider from "@provider/geo-provider";
import ImageModalProvider from "@provider/image-modal-provider";
import LoadMarker from "@provider/load-marker";
import ThemeProvider from "@provider/theme-provider";
import { Toaster } from "@provider/toaster";
import UserProvider from "@provider/user-provider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import getDeviceType from "@/lib/get-device-type";
import { Device } from "./mypage/page";
import { headers } from "next/headers";

declare global {
  interface Window {
    kakao: any;
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

export const metadata: Metadata = {
  title: "대한민국 철봉 지도",
  description:
    "대한민국 철봉 지도에서 전국 공원의 철봉 위치를 직접 등록하고 조회하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={pretendard.className}>
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
            <KakaoMap deviceType={deviceType} />
          </ChatIdProvider>
        </ThemeProvider>
        <div id="portal"></div>
        <div id="image-portal"></div>
      </body>
    </html>
  );
}
