import getAllReports from "@/lib/api/report/get-all-reports";
import AdminClient from "./admin-client";
import { cookies } from "next/headers";
import myInfo from "@/lib/api/user/myInfo";

const AdminPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const data = await getAllReports(decodeCookie);
  const user = await myInfo(decodeCookie);

  const noUser = !user || user.error;

  if (noUser) {
    return (
      <h1 className="text-xl font-bold text-center mt-14">
        접근 권한이 없습니다.
      </h1>
    );
  }

  return <AdminClient data={data} />;
};

export default AdminPage;
