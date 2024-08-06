import { Pos } from "@/types/kakao-map.types";
import ShadowBox from "@common/shadow-box";
import Text from "@common/text";
import useMapStore from "@store/useMapStore";

interface OverlayProps {
  title: string;
  position: Pos;
}

const Overlay = ({ title, position }: OverlayProps) => {
  // const [address, setAddress] = useState("");

  const { map } = useMapStore();

  // useEffect(() => {
  //   const fetch = async () => {
  //     const response = await getAddress({ lat: position.Ma, lng: position.La });

  //     if (response.code === -2) {
  //       setAddress("위치 정보 없음");
  //       return;
  //     }

  //     const { address_name, region_2depth_name, region_3depth_name } =
  //       response.documents[0];

  //     const title =
  //       region_2depth_name !== "" || region_3depth_name !== ""
  //         ? `${region_2depth_name} ${region_3depth_name}`
  //         : address_name;

  //     setAddress(title);
  //   };
  //   fetch();
  // }, []);

  const handleClick = () => {
    if (!map) return;

    const level = map.getLevel();

    map.setLevel(level - 1, { anchor: position });
  };

  return (
    <ShadowBox className="bg-white absolute -bottom-3 -left-10 w-[80px] h-[55px] flex items-center justify-center rounded-[3rem]">
      <button className="w-full h-full" onClick={handleClick}>
        {/* {address} */}
        <Text>{title}</Text>
      </button>
    </ShadowBox>
  );
};

export default Overlay;
