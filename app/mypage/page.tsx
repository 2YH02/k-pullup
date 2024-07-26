import SideMain from "@common/side-main";
import Link from "next/link";

const Mypage = () => {
  return (
    <SideMain headerTitle="내 정보" fullHeight withNav>
      <Link href="/signin" className="border border-solid border-red p-4">
        로그인 및 회원가입하기
      </Link>
    </SideMain>
  );
};

export default Mypage;
