import fetchData from "@lib/fetchData";

const approveReport = async (reportId: number) => {
  const response = await fetchData(`/api/v1/reports/approve/${reportId}`, {
    method: "POST",
    cache: "no-store",
    credentials: "include",
  });

  return response;
};

export default approveReport;
