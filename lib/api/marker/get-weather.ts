export interface WeatherRes {
  temperature: string;
  desc: string;
  humidity: string;
  rainfall: string;
  snowfall: string;
  iconImage: string;
}

const getWeather = async (lat: number, lng: number): Promise<WeatherRes> => {
  const isServer = typeof window === "undefined";

  const url = isServer ? process.env.NEXT_PUBLIC_BASE_URL : "/api/v1";

  const response = await fetch(
    `${url}/markers/weather?latitude=${lat}&longitude=${lng}`
  );

  const data = await response.json();

  return data;
};

export default getWeather;
