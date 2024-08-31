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

  if (!response.ok) {
    const msg = await response.json();
    if (response.status === 401) {
      const data: Response = {
        error: msg.error,
      };
      return data;
    } else {
      const data: Response = {
        error: msg.message,
      };
      return data;
    }
  }

  const data: Response = {
    data: await response.json(),
  };
  return data;
};

export default mySuggested;
