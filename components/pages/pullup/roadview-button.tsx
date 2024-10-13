import IconButton from "@common/icon-button";
import useRoadviewStore from "@store/useRoadviewStore";
import { MapPin } from "lucide-react";

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
      icon={<MapPin size={26} color="#f9b4ab" />}
      text="거리뷰"
      className="flex-1"
      onClick={open}
    />
  );
};

export default RoadviewButton;
