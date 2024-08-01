const deleteComment = async (id: number) => {
  const response = await fetch(`/api/v1/comments/${id}`, {
    method: "delete",
    credentials: "include",
    cache: "no-store",
  });

  return response;
};

export default deleteComment;
