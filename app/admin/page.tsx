import getAllReports from "@/lib/api/report/get-all-reports";
import myInfo from "@/lib/api/user/myInfo";
import guardServerFetch from "@lib/server-fetch-guard";
import { cookies } from "next/headers";
import AdminClient from "./admin-client";

const AdminPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const { status, data: user } = await guardServerFetch(() =>
    myInfo(decodeCookie)
  );

  if (status !== "ok" || !user || !user.chulbong) {
    return (
      <h1 className="text-xl font-bold text-center mt-14">
        접근 권한이 없습니다.
      </h1>
    );
  }

  const { data } = await guardServerFetch(() => getAllReports(decodeCookie));

  if (!data) {
    return (
      <h1 className="text-xl font-bold text-center mt-14">
        데이터를 불러올 수 없습니다.
      </h1>
    );
  }

  return <AdminClient data={data} />;
};

export default AdminPage;
