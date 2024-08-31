import fetchData from "@lib/fetchData";

const downloadPdf = async ({ lat, lng }: { lat: number; lng: number }) => {
  const response = await fetchData(
    `/api/v1/markers/save-offline?latitude=${lat}&longitude=${lng}`
  );

  return response;
};

export default downloadPdf;
