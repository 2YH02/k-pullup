import fetchData from "@lib/fetchData";
import { getApiBase } from "@lib/api-base";

export interface WeatherRes {
  temperature: string;
  desc: string;
  humidity: string;
  rainfall: string;
  snowfall: string;
  iconImage: string;
}

const getWeather = async (lat: number, lng: number): Promise<WeatherRes> => {
  const url = getApiBase();

  const response = await fetchData(
    `${url}/markers/weather?latitude=${lat}&longitude=${lng}`
  );

  const data = await response.json();

  return data;
};

export default getWeather;
