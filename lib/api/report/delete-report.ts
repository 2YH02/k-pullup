import fetchData from "@lib/fetchData";

const deleteReport = async (markerId: number, reportId: number) => {
  const response = await fetchData(
    `/api/v1/reports?markerID=${markerId}&reportID=${reportId}`,
    {
      method: "DELETE",
      cache: "no-store",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || errorData.message || "Failed to fetch favorites"
    );
  }

  return response;
};

export default deleteReport;
