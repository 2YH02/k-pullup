import fetchData from "@lib/fetchData";

export type ReportStatus = "APPROVED" | "DENIED" | "PENDING";

export interface ReportsRes {
  createdAt: Date;
  description: string;
  latitude: number;
  longitude: number;
  newLatitude: number;
  newLongitude: number;
  markerId: number;
  reportId: number;
  status: ReportStatus;
  photoUrls: string[];
  userId: number;
  address: string;
}

interface Response {
  data?: ReportsRes[];
  error?: string;
  message?: string;
}

const mySuggested = async (cookie?: string) => {
  const isServer = typeof window === "undefined";

  const url = isServer ? process.env.NEXT_PUBLIC_BASE_URL : "/api/v1";

  const response = await fetchData(`${url}/users/reports`, {
    headers: {
      Cookie: cookie || "",
    },
    cache: "no-store",
    credentials: "include",
  });

  // fetchData 가 non-2xx 에서 throw 하므로 여기 도달하면 항상 성공.
  const data: Response = {
    data: await response.json(),
  };
  return data;
};

export default mySuggested;
