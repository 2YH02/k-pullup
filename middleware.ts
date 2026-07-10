import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/signin",
  "/signup",
  "/reset-password",
  "/search",
  "/article",
  "/notice",
  "/pullup",
  "/social",
  "/challenge",
  "/moments",
  "/terms",
  "/user-info",
];

const SKIP_PREFIXES = [
  "/_next/static",
  "/_next/image",
  "/favicon.ico",
  "/api/v1",
];

// 정적 파일 확장자 — public/ 폴더 자산이 미들웨어에 의해 차단되지 않도록
const STATIC_FILE_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
  ".ico",
  ".txt",
  ".xml",
  ".json",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".mp4",
  ".webm",
];

const SESSION_COOKIE_NAME = "session";

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // 1. SKIP_PREFIXES에 해당하면 통과
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // 1.5. 정적 파일 확장자면 통과 (public/ 폴더 자산)
  if (STATIC_FILE_EXTENSIONS.some((ext) => pathname.endsWith(ext))) {
    return NextResponse.next();
  }

  // 2. PUBLIC_PATHS에 해당하면 통과 (startsWith로 하위 경로 포함)
  if (
    PUBLIC_PATHS.some((path) => {
      if (path === "/") {
        return pathname === "/";
      }
      return pathname === path || pathname.startsWith(`${path}/`);
    })
  ) {
    return NextResponse.next();
  }

  // 3. 세션 쿠키 존재하면 통과
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  if (sessionCookie) {
    return NextResponse.next();
  }

  // 4. 쿠키 없으면 /signin?returnUrl=<현재경로>로 리다이렉트
  const signinUrl = new URL("/signin", request.url);
  signinUrl.searchParams.set("returnUrl", pathname);
  return NextResponse.redirect(signinUrl);
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
