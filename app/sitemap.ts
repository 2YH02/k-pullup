import type { MarkerRes } from "@api/marker/get-all-marker";
import { BASE_URL } from "@constant/index";
import { MetadataRoute } from "next";

const getAllMarker = async (): Promise<MarkerRes[]> => {
  const response = await fetch(`https://api.k-pullup.com/api/v1/markers`);

  const data = await response.json();
  return data;
};

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const pullup = await getAllMarker();
  const pullupMap = pullup.map((marker) => ({
    url: `${BASE_URL}/pullup/${marker.markerId}`,
  }));

  const routesMap = [
    "",
    "/home",
    "/mypage",
    "/search",
    "/signin",
    "/signup",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
  }));

  return [...routesMap, ...pullupMap];
};

export default sitemap;
