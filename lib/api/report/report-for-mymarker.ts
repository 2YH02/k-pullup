import fetchData from "@lib/fetchData";
import { getApiBase } from "@lib/api-base";
import { ReportStatus } from "./my-suggested";

export interface Report {
  reportID: number;
  description: string;
  status: ReportStatus;
  createdAt: string;
  photos: string[];
}

interface Marker {
  [key: string]: { markerID: number; reports: Report[]; address: string };
}

export interface MyMarkerReportRes {
  totalReports: number;
  markers: Marker;
  message?: string;
  error?: string;
}

const reportForMymarker = async (cookie?: string) => {
  const url = getApiBase();

  const response = await fetchData(`${url}/users/reports/for-my-markers`, {
    headers: {
      Cookie: cookie || "",
    },
    cache: "no-store",
    credentials: "include",
  });

  const data: MyMarkerReportRes = await response.json();

  return data;
};

export default reportForMymarker;
