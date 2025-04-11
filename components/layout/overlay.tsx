import cn from "@/lib/cn";
import { Pos } from "@/types/kakao-map.types";
import useMapStore from "@store/useMapStore";

interface OverlayProps {
  title: string;
  position: Pos;
}

const Overlay = ({ title, position }: OverlayProps) => {
  const { map } = useMapStore();

  const handleClick = () => {
    if (!map) return;

    const level = map.getLevel();

    map.setLevel(level - 1, { anchor: position });
  };

  return (
    <div
      className={cn(
        "opacity-80 absolut -bottom-3 -left-10 w-[60px] h-[60px] flex items-center justify-center rounded-full shadow-full",
        getTailwindColorClass(convertToNumber(title))
      )}
    >
      <button className="w-full h-full z-10 text-white" onClick={handleClick}>
        <div>{title}</div>
      </button>
      <span
        className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-65",
          getTailwindColorClass(convertToNumber(title))
        )}
      ></span>
    </div>
  );
};

const getTailwindColorClass = (count: number): string => {
  if (count < 100) {
    return "bg-green";
  } else if (count < 500) {
    return "bg-blue";
  } else if (count < 1000) {
    return "bg-yellow";
  } else if (count < 5000) {
    return "bg-red";
  } else {
    return "bg-red";
  }
};

const convertToNumber = (str: string): number => {
  return parseInt(str, 10);
};

export default Overlay;
