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
  const response = await fetch(
    `/api/v1/comments/${id}/comments?page=${pageParam}&pageSize=10`
  );

  const data = await response.json();

  return data;
};

export default getComments;
