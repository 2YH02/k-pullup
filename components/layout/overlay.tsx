import ShadowBox from "@common/shadow-box";
import Text from "@common/text";
import useMapStore from "@store/useMapStore";

interface OverlayProps {
  title: string;
  position: any;
}

const Overlay = ({ title, position }: OverlayProps) => {
  const { map } = useMapStore();

  const handleClick = () => {
    if (!map) return;

    const level = map.getLevel();

    map.setLevel(level - 1, { anchor: position });
  };
  return (
    <ShadowBox className="bg-white absolute -bottom-3 -left-10 w-[80px] h-[55px] flex items-center justify-center rounded-[3rem]">
      <button className="w-full h-full" onClick={handleClick}>
        <Text>{title}</Text>
      </button>
    </ShadowBox>
  );
};

export default Overlay;
