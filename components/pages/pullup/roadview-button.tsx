import IconButton from "@common/icon-button";
import PinIcon from "@icons/pin-icon";

const RoadviewButton = () => {
  return (
    <IconButton icon={<PinIcon size={26} />} text="거리뷰" className="flex-1" />
  );
};

export default RoadviewButton;
