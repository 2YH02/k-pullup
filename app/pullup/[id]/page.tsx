import { type Device } from "@/app/mypage/page";
import getComments from "@api/comment/get-comments";
import getFacilities from "@api/marker/get-facilities";
import markerDetail from "@api/marker/marker-detail";
import getDeviceType from "@lib/get-device-type";
import NotFoud from "@pages/pullup/not-foud";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import PullupClient from "./pullup-client";

type Params = {
  id: string;
};

// Cache markerDetail to avoid duplicate calls between metadata and page render
const getCachedMarkerDetail = cache(
  async (id: number, cookie: string) => markerDetail({ id, cookie })
);

export const generateMetadata = async ({ params }: { params: Params }) => {
  const { id } = params;

  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const { address, description, favCount, photos } = await getCachedMarkerDetail(
    ~~id,
    decodeCookie
  );

  return {
    title: `${address} - 대한민국 철봉 지도`,
    description: `즐거운 맨몸운동 생활 - ${description} - ${address} - 좋아요 : ${favCount}`,
    keywords: `철봉, ${address}`,
    openGraph: {
      type: "website",
      url: `https://www.k-pullup.com/pullup/${id}`,
      title: `${address} | 철봉`,
      description: `즐거운 맨몸운동 생활 - ${description} - ${address} - 좋아요 : ${favCount}`,
      images: photos ? photos[0].photoUrl : "/metaimg.webp",
    },
    twitter: {
      card: "summary_large_image",
      title: `${address} | 철봉`,
      description: `즐거운 맨몸운동 생활 - ${description} - ${address} - 좋아요 : ${favCount}`,
      images: photos ? photos[0].photoUrl : "/metaimg.webp",
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

  // Parallel fetch all data to avoid waterfall
  const [marker, facilities, initialComments] = await Promise.all([
    getCachedMarkerDetail(~~id, decodeCookie),
    getFacilities(~~id),
    getComments({ id: ~~id, pageParam: 1 }),
  ]);

  if (marker.error === "Marker not found") {
    return <NotFoud addr={marker.addr} />;
  }

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
