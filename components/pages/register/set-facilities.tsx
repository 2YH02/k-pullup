import BottomFixedButton from "@common/bottom-fixed-button";
import GrowBox from "@common/grow-box";
import Section from "@common/section";
import Text from "@common/text";
import MinusIcon from "@icons/minuse-icon";
import PlusIcon from "@icons/plus-icon";

interface SetFacilitiesProps {
  increase: (cnt: number) => void;
  decrease: (cnt: number) => void;
  철봉: number;
  평행봉: number;
  next: VoidFunction;
}

interface FacilityProps {
  name: string;
  count: number;
  increase: VoidFunction;
  decrease: VoidFunction;
}

const SetFacilities = ({
  next,
  decrease,
  increase,
  철봉,
  평행봉,
}: SetFacilitiesProps) => {
  return (
    <Section className="h-full pb-0 flex flex-col">
      <div className="my-5">
        <Text fontWeight="bold">기구들의 개수를 입력해주시면</Text>
        <Text fontWeight="bold">
          다른 사람이 더욱 정확한 정보를 확인할 수 있습니다!
        </Text>
      </div>

      <div className="border border-solid border-primary rounded-md px-2">
        <FacilityList
          name="철봉"
          count={철봉}
          increase={() => {
            if (철봉 === 99) return;
            increase(1);
          }}
          decrease={() => {
            if (철봉 === 0) return;
            decrease(1);
          }}
        />
        <FacilityList
          name="평행봉"
          count={평행봉}
          increase={() => {
            if (평행봉 === 99) return;
            increase(2);
          }}
          decrease={() => {
            if (평행봉 === 0) return;
            decrease(2);
          }}
        />
      </div>
      {/* <Text typography="t6" className="text-red mt-3">
        {errorMessage}
      </Text> */}

      <GrowBox />

      <BottomFixedButton
        onClick={next}
        className="flex items-center justify-center h-12"
        containerStyle="px-0"
      >
        다음
      </BottomFixedButton>
    </Section>
  );
};

export const FacilityList = ({
  count,
  name,
  decrease,
  increase,
}: FacilityProps) => {
  return (
    <div className="flex items-center my-2">
      <Text>{name}</Text>
      <GrowBox />
      <span className="flex items-center">
        <button
          className="rounded-full p-1 hover:bg-white-tp-dark"
          onClick={() => decrease()}
        >
          <MinusIcon size={18} />
        </button>
        <Text className="flex items-center justify-center w-10">{count}</Text>
        <button
          className="rounded-full p-1 hover:bg-white-tp-dark"
          onClick={() => increase()}
        >
          <PlusIcon size={18} />
        </button>
      </span>
    </div>
  );
};

export default SetFacilities;
