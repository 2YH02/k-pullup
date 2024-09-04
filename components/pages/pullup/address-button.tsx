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
    <div onClick={() => move({ lat, lng })}>
      <Text
        typography="t4"
        className="w-full break-words mt-3 select-text hover:underline"
      >
        {address}
      </Text>
    </div>
  );
};

export default AddressButton;
