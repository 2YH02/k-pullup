"use client";

import Button from "@/components/common/button";
import useAlertStore from "@/store/useAlertStore";
import SideMain from "@common/side-main";

const Register = () => {
  const { openAlert } = useAlertStore();

  const handleClick = () => {
    openAlert({
      title: "안녕하세요",
      description: "설명을 입력해주세요.",
      onClick: () => {
        console.log("버튼 클릭");
      },
    });
  };

  return (
    <SideMain withNav>
      <Button onClick={handleClick}>클릭</Button>
    </SideMain>
  );
};

export default Register;
