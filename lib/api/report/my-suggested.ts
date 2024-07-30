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

const mySuggested = async (cookie?: string): Promise<ReportsRes[]> => {
  const isServer = typeof window === "undefined";

  const url = isServer ? process.env.NEXT_PUBLIC_BASE_URL : "/api/v1";

  const response = await fetch(`${url}/users/reports`, {
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

  const data: ReportsRes[] = await response.json();

  return data;
};

export default mySuggested;
