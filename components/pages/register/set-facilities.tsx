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
    <Section className="flex h-full flex-col pb-4">
      <div className="my-4 rounded-xl border border-location-badge-bg/80 bg-location-badge-bg/45 px-3.5 py-3 dark:border-location-badge-bg-dark/70 dark:bg-location-badge-bg-dark/35">
        <Text
          fontWeight="bold"
          className="text-text-on-surface dark:text-grey-light"
        >
          기구들의 개수를 입력해주시면
        </Text>
        <Text
          typography="t6"
          className="text-grey-dark dark:text-grey"
        >
          다른 사람이 더욱 정확한 정보를 확인할 수 있습니다.
        </Text>
      </div>

      <div className="rounded-xl border border-primary/25 bg-search-input-bg/45 px-3 py-2 dark:border-primary-dark/50 dark:bg-black/30">
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
      <Text
        typography="t7"
        className="mt-2 text-text-on-surface-muted dark:text-grey"
      >
        필요한 경우 건너뛰고 다음 단계로 이동할 수 있습니다.
      </Text>

      <GrowBox />

      {/* <BottomFixedButton
        onClick={next}
        className="flex items-center justify-center h-12"
        containerStyle="px-0"
      >
        다음
      </BottomFixedButton> */}
      <Button onClick={next} className="h-12">
        다음
      </Button>
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
