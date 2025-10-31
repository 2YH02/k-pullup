import fetchData from "@lib/fetchData";

export interface Comment {
  commentId: number;
  markerId: number;
  userId: number;
  commentText: string;
  postedAt: string;
  updatedAt: string;
  username: string;
}

interface Props {
  id: number;
  pageParam: number;
}

export interface CommentsRes {
  currentPage: number;
  comments: Comment[];
  totalComments: number;
  totalPages: number;
  error?: string;
}

const getComments = async ({ id, pageParam }: Props): Promise<CommentsRes> => {
  const isServer = typeof window === "undefined";
  const url = isServer ? process.env.NEXT_PUBLIC_BASE_URL : "/api/v1";

  const response = await fetchData(
    `${url}/comments/${id}/comments?page=${pageParam}&pageSize=10`
  );

  const data = await response.json();

  return data;
};

export default getComments;
