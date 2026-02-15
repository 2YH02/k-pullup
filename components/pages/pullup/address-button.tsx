"use client";

import Text from "@common/text";
import useMapControl from "@hooks/useMapControl";

interface AddressButtonProps {
  lat: number;
  lng: number;
  address: string;
}

const AddressButton = ({ lat, lng, address }: AddressButtonProps) => {
  const { move } = useMapControl();

  return (
    <button
      type="button"
      onClick={() => move({ lat, lng })}
      className="group w-full rounded-md text-left transition-colors duration-150 active:opacity-80 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/35"
    >
      <Text
        typography="t4"
        className="w-full wrap-break-word text-text-on-surface underline-offset-2 transition-colors duration-150 group-hover:underline group-active:text-primary-dark dark:text-grey-light"
      >
        {address}
      </Text>
    </button>
  );
};

export default AddressButton;
