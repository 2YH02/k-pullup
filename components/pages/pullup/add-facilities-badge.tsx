"use client";

import Badge from "@common/badge";
import { LucidePlus } from "lucide-react";
import { useRouter } from "next/navigation";

const AddFacilitiesBadge = ({ markerId }: { markerId: number }) => {
  const router = useRouter();

  return (
    <Badge
      text="기구 개수 수정"
      className="flex items-center justify-center mr-2 mb-2 h-8"
      textStyle="leading-3"
      icon={<LucidePlus size={18} />}
      onClick={() => {
        router.push(`/pullup/${markerId}/facilities`);
      }}
      isButton
    />
  );
};

export default AddFacilitiesBadge;
