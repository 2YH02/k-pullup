import fetchData from "@lib/fetchData";

const locateVerify = async (lat: number, lng: number) => {
  const response = await fetchData(
    `/api/v1/markers/verify?latitude=${lat}&longitude=${lng}`
  );

  if (response.status === 200) {
    return "ok";
  } else {
    const data = await response.json();
    return data;
  }
};

export default locateVerify;
