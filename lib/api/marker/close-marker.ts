interface Props {
  lat: number;
  lng: number;
  distance: number;
  pageParam: number;
}

export interface CloseMarker {
  latitude: number;
  longitude: number;
  distance: number;
  markerId: number;
  description: string;
  address?: string;
}

interface CloseMarkerRes {
  currentPage: number;
  markers: CloseMarker[];
  totalMarkers: number;
  totalPages: number;
}

const closeMarker = async ({
  lat,
  lng,
  distance,
  pageParam,
}: Props): Promise<CloseMarkerRes> => {
  const response = await fetch(
    `/api/v1/markers/close?latitude=${lat}&longitude=${lng}&distance=${distance}&n=5&page=${pageParam}&pageSize=10`
  );

  const data = response.json();

  return data;
};

export default closeMarker;
