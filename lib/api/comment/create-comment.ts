const createComment = async (body: {
  markerId: number;
  commentText: string;
}) => {
  const response = await fetch(`/api/v1/comments`, {
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
