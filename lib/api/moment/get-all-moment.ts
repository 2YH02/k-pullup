import fetchData from "@lib/fetchData";

const getAllMoment = async () => {
  const isServer = typeof window === "undefined";

  const url = isServer ? process.env.NEXT_PUBLIC_BASE_URL : "/api/v1";

  const response = await fetchData(`${url}/markers/stories`);

  if (!response.ok) throw new Error("에러");

  const data = await response.json();

  return data;
};

export default getAllMoment;
