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

  return <AdminClient data={data} />;
};

export default AdminPage;
