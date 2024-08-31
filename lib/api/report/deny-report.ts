import fetchData from "@lib/fetchData";

const denyReport = async (reportId: number) => {
  const response = await fetchData(`/api/v1/reports/deny/${reportId}`, {
    method: "POST",
    cache: "no-store",
    credentials: "include",
  });

  return response;
};

export default denyReport;
