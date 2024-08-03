const downloadPdf = async ({ lat, lng }: { lat: number; lng: number }) => {
  const response = await fetch(
    `/api/v1/markers/save-offline?latitude=${lat}&longitude=${lng}`
  );

  return response;
};

export default downloadPdf;
