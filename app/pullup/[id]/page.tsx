import SideMain from "@/components/common/side-main";
import React from "react";

const PullupPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return (
    <SideMain headerTitle="상세" hasBackButton withNav>
      {id}
    </SideMain>
  );
};

export default PullupPage;
