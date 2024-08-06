export interface SearchMarkers {
  address: string;
  markerId: number;
}

export interface SearchRes {
  took: number;
  markers: SearchMarkers[];
  error?: string;
  message?: string;
}

const search = async (query: string): Promise<SearchRes> => {
  const response = await fetch(`/api/v1/search/marker?term=${query}`);

  const data = await response.json();

  return data;
};

export default search;
