import IconButton from "@common/icon-button";
import useRoadviewStore from "@store/useRoadviewStore";
import { BsFillPinMapFill } from "react-icons/bs";

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
      icon={<BsFillPinMapFill size={20} className="fill-primary" />}
      text="거리뷰"
      className="flex-1 active:bg-black/5 dark:active:bg-white/10"
      onClick={open}
    />
  );
};

export default RoadviewButton;
