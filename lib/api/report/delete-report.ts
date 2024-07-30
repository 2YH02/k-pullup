const deleteReport = async (markerId: number, reportId: number) => {
  const response = await fetch(
    `/api/v1/reports?markerID=${markerId}&reportID=${reportId}`,
    {
      method: "DELETE",
      cache: "no-store",
      credentials: "include",
    }
  );

  if (!response.ok) {
    console.log(response);
    const errorData = await response.json();
    console.log(errorData);
    // throw new Error(errorData.error || "Failed to fetch favorites");
  }

  return response;
};

export default deleteReport;
