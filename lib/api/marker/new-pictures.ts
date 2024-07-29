export interface newPicturesRes {
  markerId: number;
  photoURL: string;
}

const newPictures = async (): Promise<newPicturesRes[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/markers/new-pictures`
  );

  const data = await response.json();

  return data;
};

export default newPictures;
