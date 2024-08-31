const fetchData = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const response = await fetch(url, options);

  if (response.status === 429) {
    alert("요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.");
  }

  return response;
};

export default fetchData;
