import Button from "@common/button";
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

      {/* <BottomFixedButton
        onClick={next}
        className="flex items-center justify-center h-12"
        containerStyle="px-0"
      >
        다음
      </BottomFixedButton> */}
      <Button onClick={next}>다음</Button>
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
    <div className="my-1.5 flex items-center rounded-lg px-1.5 py-1">
      <Text className="text-text-on-surface dark:text-grey-light">{name}</Text>
      <GrowBox />
      <span className="flex items-center rounded-full border border-grey-light/80 bg-side-main px-1 py-0.5 dark:border-grey-dark/80 dark:bg-black/35">
        <button
          className="rounded-full p-1 text-text-on-surface transition-colors duration-150 active:scale-[0.97] active:bg-black/5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/35 dark:text-grey-light dark:active:bg-white/10"
          onClick={() => decrease()}
          aria-label={`${name} 감소`}
        >
          <MinusIcon size={18} />
        </button>
        <Text className="flex w-10 items-center justify-center text-text-on-surface dark:text-grey-light">
          {count}
        </Text>
        <button
          className="rounded-full p-1 text-text-on-surface transition-colors duration-150 active:scale-[0.97] active:bg-black/5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/35 dark:text-grey-light dark:active:bg-white/10"
          onClick={() => increase()}
          aria-label={`${name} 증가`}
        >
          <PlusIcon size={18} />
        </button>
      </span>
    </div>
  );
};

export default SetFacilities;
