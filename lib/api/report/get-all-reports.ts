import fetchData from "@lib/fetchData";
import { getApiBase } from "@lib/api-base";

export interface AllReport {
  reportId: number;
  markerId: number;
  userId: number;
  latitude: number;
  longitude: number;
  newLatitude: number;
  newLongitude: number;
  description: string;
  createdAt: string; // ISO 8601 date string
  status: "APPROVED" | "DENIED" | "PENDING";
  doesExist: boolean;
  photoUrls?: string[]; // Optional, since it appears in only one instance
}

interface MarkerReports {
  reports: AllReport[];
}

interface ReportsData {
  [markerId: string]: MarkerReports;
}

export interface AllReportRes {
  totalReports: number;
  markers: ReportsData;
  message?: string;
  error?: string;
}

const getAllReports = async (cookie?: string) => {
  const url = getApiBase();

  const response = await fetchData(`${url}/reports/all`, {
    headers: {
      Cookie: cookie || "",
    },
    cache: "no-store",
    credentials: "include",
  });

  const data: AllReportRes = await response.json();

  return data;
};

export default getAllReports;
