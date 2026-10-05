import fetchData from "@lib/fetchData";
import { getApiBase } from "@lib/api-base";

export type ContributionLevel =
  | "초보 운동자"
  | "운동 길잡이"
  | "철봉 탐험가"
  | "스트릿 워리어"
  | "피트니스 전도사"
  | "철봉 레인저"
  | "철봉 매버릭"
  | "거장"
  | "명인";

export interface MyInfo {
  userId: number;
  username: string;
  email: string;
  contributionCount?: number;
  contributionLevel?: ContributionLevel;
  provider?: "google" | "naver" | "kakao" | "website";
  chulbong?: boolean;
  reportCount?: number;
  markerCount?: number;
  error?: string;
}

const myInfo = async (cookie?: string): Promise<MyInfo> => {
  const url = getApiBase();

  const response = await fetchData(`${url}/users/me`, {
    headers: {
      Cookie: cookie || "",
    },
    cache: "no-store",
    credentials: "include",
  });

  const data = await response.json();

  return data;
};

export default myInfo;
