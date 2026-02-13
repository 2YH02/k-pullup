import Text from "@common/text";
import Image from "next/image";
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
          <Image
            className="h-auto w-full object-cover"
            src="/pullup1.jpg"
            alt=""
            width={400}
            height={400}
          />
          <Image
            className="h-auto w-full object-cover"
            src="/pullup3.jpg"
            alt=""
            width={400}
            height={400}
          />
          <Image
            className="h-auto w-full object-cover"
            src="/pullup2.jpg"
            alt=""
            width={400}
            height={400}
          />
        </div>
        <div className="w-1/3 flex flex-col gap-1">
          <Image
            className="h-auto w-full object-cover"
            src="/pullup2.jpg"
            alt=""
            width={400}
            height={400}
          />
          <Image
            className="h-auto w-full object-cover"
            src="/pullup1.jpg"
            alt=""
            width={400}
            height={400}
          />
          <Image
            className="h-auto w-full object-cover"
            src="/pullup3.jpg"
            alt=""
            width={400}
            height={400}
          />
        </div>
        <div className="w-1/3 flex flex-col gap-1">
          <Image
            className="h-auto w-full object-cover"
            src="/pullup3.jpg"
            alt=""
            width={400}
            height={400}
          />
          <Image
            className="h-auto w-full object-cover"
            src="/pullup2.jpg"
            alt=""
            width={400}
            height={400}
          />
          <Image
            className="h-auto w-full object-cover"
            src="/pullup1.jpg"
            alt=""
            width={400}
            height={400}
          />
        </div>
      </div>
    </div>
  );
};

export default MomentsGallery;
