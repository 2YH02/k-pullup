import { type Device } from "@/app/mypage/page";
import getComments from "@api/comment/get-comments";
import getFacilities from "@api/marker/get-facilities";
import markerDetail from "@api/marker/marker-detail";
import getDeviceType from "@lib/get-device-type";
import guardServerFetch from "@lib/server-fetch-guard";
import NotFoud from "@pages/pullup/not-foud";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import PullupClient from "./pullup-client";

type Params = {
  id: string;
};

const getCachedMarkerDetail = cache(
  async (id: number, cookie: string) => markerDetail({ id, cookie })
);

export const generateMetadata = async ({ params }: { params: Params }) => {
  const { id } = params;

  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const { status, data: marker } = await guardServerFetch(() =>
    getCachedMarkerDetail(~~id, decodeCookie)
  );

  if (status !== "ok" || !marker) {
    return {
      title: "대한민국 철봉 지도",
    };
  }

  const { address, description, favCount } = marker;

  const shortDesc =
    description.length > 80 ? description.slice(0, 80) + "…" : description;

  const count = favCount ?? 0;
  const pageDesc = shortDesc
    ? `${shortDesc} · 즐겨찾기 ${count}개`
    : `즐겨찾기 ${count}명이 저장한 철봉 위치입니다.`;

  return {
    title: `${address} | 대한민국 철봉 지도`,
    description: pageDesc,
    keywords: `철봉, 풀업바, 맨몸운동, ${address}`,
    openGraph: {
      type: "website",
      siteName: "대한민국 철봉 지도",
      url: `https://www.k-pullup.com/pullup/${id}`,
      title: address,
      description: pageDesc,
    },
    twitter: {
      card: "summary_large_image",
      title: address,
      description: pageDesc,
    },
  };
};

const PullupPage = async ({ params }: { params: Params }) => {
  const { id } = params;
  const headersList = headers();
  const referrer = headersList.get("referer");
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const { status, data: marker } = await guardServerFetch(() =>
    getCachedMarkerDetail(~~id, decodeCookie)
  );

  if (status === "notfound" || status === "unauthorized" || !marker) {
    return <NotFoud />;
  }

  const [facilities, initialComments] = await Promise.all([
    getFacilities(~~id).catch(() => []),
    getComments({ id: ~~id, pageParam: 1 }).catch(() => ({
      currentPage: 1,
      comments: [],
      totalComments: 0,
      totalPages: 0,
    })),
  ]);

  return (
    <PullupClient
      deviceType={deviceType}
      referrer={referrer}
      marker={marker}
      facilities={facilities}
      initialComments={initialComments}
    />
  );
};

export default PullupPage;
