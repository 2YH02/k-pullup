import IconButton from "@common/icon-button";
import PinIcon from "@icons/pin-icon";
import useRoadviewStore from "@store/useRoadviewStore";

interface RoadviewButtonProps {
  lat: number;
  lng: number;
}

const RoadviewButton = ({ lat, lng }: RoadviewButtonProps) => {
  const { openRoadview } = useRoadviewStore();

  const open = () => {
    openRoadview({
      lat,
      lng,
    });
  };

  return (
    <IconButton
      icon={<PinIcon size={26} />}
      text="거리뷰"
      className="flex-1"
      onClick={open}
    />
  );
};

export default RoadviewButton;
