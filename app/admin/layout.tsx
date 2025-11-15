import ThemeProvider from "@provider/theme-provider";
import { Toaster } from "@provider/toaster";
import UserProvider from "@provider/user-provider";
import type { Metadata } from "next";
import localFont from "next/font/local";

const pretendard = localFont({
  src: [
    {
      path: "../assets/Pretendard-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/Pretendard-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/Pretendard-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/Pretendard-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/Pretendard-ExtraBold.woff",
      weight: "800",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "대한민국 철봉 지도",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`light ${pretendard.className} w-dvh h-dvh bg-gray-50 text-gray-900 p-4 overflow-auto`} style={{ color: '#111827', colorScheme: 'light' }} data-theme="light">
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        forcedTheme="light"
        disableTransitionOnChange
      >
        <UserProvider>
          {children}
          <Toaster />
        </UserProvider>
      </ThemeProvider>
    </div>
  );
}
