import fetchData from "@lib/fetchData";

const createComment = async (body: {
  markerId: number;
  commentText: string;
}) => {
  const response = await fetchData(`/api/v1/comments`, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response;
};

export default createComment;
