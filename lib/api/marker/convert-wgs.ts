import fetchData from "@lib/fetchData";
import { getApiBase } from "@lib/api-base";

const convertWgs = async (lat: number, lng: number) => {
  const url = getApiBase();

  const response = await fetchData(
    `${url}/markers/convert?latitude=${lat}&longitude=${lng}`
  );

  const data = await response.json();

  return data;
};

export default convertWgs;
