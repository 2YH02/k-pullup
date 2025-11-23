import fetchData from "@lib/fetchData";

export interface DeleteMarkerPhotoResponse {
  message: string;
}

export interface DeleteMarkerPhotoError {
  error: string;
}

/**
 * Deletes a single photo from a marker
 *
 * Backend endpoint: DELETE /api/v1/markers/{markerID}/photos/{photoID}
 *
 * Authorization: Owner or Admin only
 *
 * Response semantics:
 * - 200: Photo deleted successfully OR photo already absent (idempotent)
 * - 403: Unauthorized (not owner or admin)
 * - 400: Invalid parameters
 * - 500: Internal server error
 *
 * The response includes `X-Idempotent: true` header for idempotent operations.
 *
 * @param markerId - The marker ID
 * @param photoId - The photo ID to delete
 * @returns Promise with response (message or error)
 */
const deleteMarkerPhoto = async (
  markerId: number,
  photoId: number
): Promise<Response> => {
  const response = await fetchData(
    `/api/v1/markers/${markerId}/photos/${photoId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  return response;
};

export default deleteMarkerPhoto;
