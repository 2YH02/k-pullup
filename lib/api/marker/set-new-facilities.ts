export interface Facilities {
  facilityId: number;
  quantity: number;
}

const setNewFacilities = async (body: {
  markerId: number;
  facilities: Facilities[];
}) => {
  const response = await fetch(`/api/v1/markers/facilities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  return response;
};

export default setNewFacilities;
