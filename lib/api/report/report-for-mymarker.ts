import { ReportStatus } from "./my-suggested";

export interface Report {
  reportID: number;
  description: string;
  status: ReportStatus;
  createdAt: string;
  photos: string[];
  address: string;
}

interface Marker {
  [key: string]: Report[];
}

export interface MyMarkerReportRes {
  totalReports: number;
  markers: Marker;
}

const reportForMymarker = async (
  cookie?: string
): Promise<MyMarkerReportRes> => {
  const isServer = typeof window === "undefined";

  const url = isServer ? process.env.NEXT_PUBLIC_BASE_URL : "/api/v1";

  const response = await fetch(`${url}/users/reports/for-my-markers`, {
    headers: {
      Cookie: cookie || "",
    },
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.error || errorData.message || "Failed to fetch suggested report"
    );
  }

  const data: MyMarkerReportRes = await response.json();

  return data;
};

export default reportForMymarker;
