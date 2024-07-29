interface LatLng {
  lat: number;
  lng: number;
}

const getAddress = async ({ lat, lng }: LatLng) => {
  const response = await fetch(
    `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lng}&y=${lat}`,
    {
      headers: {
        Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_REST_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    return { code: -2 };
  }

  const data = await response.json();

  return data;
};

export default getAddress;
