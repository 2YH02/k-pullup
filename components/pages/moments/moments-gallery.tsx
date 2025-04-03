import Text from "@common/text";
import React from "react";

const MomentsGallery = () => {
  return (
    <div>
      <div>
        <Text fontWeight="bold" className="mb-1 px-4">
          모먼트
        </Text>
      </div>
      <div className="flex gap-1">
        <div className="w-1/3 flex flex-col gap-1">
          <img className="w-full object-cover" src="/pullup1.jpg" alt="" />
          <img className="w-full object-cover" src="/pullup3.jpg" alt="" />
          <img className="w-full object-cover" src="/pullup2.jpg" alt="" />
        </div>
        <div className="w-1/3 flex flex-col gap-1">
          <img className="w-full object-cover" src="/pullup2.jpg" alt="" />
          <img className="w-full object-cover" src="/pullup1.jpg" alt="" />
          <img className="w-full object-cover" src="/pullup3.jpg" alt="" />
        </div>
        <div className="w-1/3 flex flex-col gap-1">
          <img className="w-full object-cover" src="/pullup3.jpg" alt="" />
          <img className="w-full object-cover" src="/pullup2.jpg" alt="" />
          <img className="w-full object-cover" src="/pullup1.jpg" alt="" />
        </div>
      </div>
    </div>
  );
};

export default MomentsGallery;
