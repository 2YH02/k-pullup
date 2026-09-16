import fetchData from "@lib/fetchData";
import { getApiBase } from "@lib/api-base";

const getAllMoment = async () => {
  const url = getApiBase();

  const response = await fetchData(`${url}/markers/stories`, {
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) throw new Error("에러");

  const data = await response.json();

  return data;
};

export default getAllMoment;
