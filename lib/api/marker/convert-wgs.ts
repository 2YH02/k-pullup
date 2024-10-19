import fetchData from "@lib/fetchData";

const convertWgs = async (lat: number, lng: number) => {
  const isServer = typeof window === "undefined";

  const url = isServer ? process.env.NEXT_PUBLIC_BASE_URL : "/api/v1";

  const response = await fetchData(
    `${url}/markers/convert?latitude=${lat}&longitude=${lng}`
  );

  const data = await response.json();

  return data;
};

export default convertWgs;
