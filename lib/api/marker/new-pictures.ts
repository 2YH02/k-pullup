import fetchData from "@lib/fetchData";
import { getApiBase } from "@lib/api-base";

export interface NewPictures {
  markerId: number;
  photoURL: string;
  blurhash?: string;
}

export type NewPicturesError = { error: string };
export type NewPicturesResponse = NewPictures[] | NewPicturesError;

const newPictures = async (): Promise<NewPicturesResponse> => {
  const response = await fetchData(
    `${getApiBase()}/markers/new-pictures`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  const data = await response.json();

  return data;
};

export default newPictures;

export function isNewPicturesError(
  res: NewPicturesResponse
): res is NewPicturesError {
  return (res as NewPicturesError).error !== undefined;
}
