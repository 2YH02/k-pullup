import fetchData from "@lib/fetchData";

const signout = async () => {
  const response = await fetchData(`/api/v1/auth/logout`, {
    method: "POST",
    credentials: "include",
    // 페이지가 언로드(하드 네비게이션)되어도 요청이 취소되지 않도록 보장
    keepalive: true,
  });

  const data = response.json();

  return data;
};
export default signout;
