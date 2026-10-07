import Button from "@common/button";
import GrowBox from "@common/grow-box";
import Section from "@common/section";
import Text from "@common/text";
import MinusIcon from "@icons/minus-icon";
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
          설치된 기구 수를 알려주시면
        </Text>
        <Text
          typography="t6"
          className="text-grey-dark dark:text-grey"
        >
          다른 사람도 장소를 더 쉽게 확인할 수 있습니다.
        </Text>
      </div>

      <div className="rounded-xl border border-primary/25 bg-search-input-bg/45 px-3 py-2 dark:border-primary-dark/50 dark:bg-black/30">
        <FacilityList
          name="철봉"
          count={철봉}
          increase={() => increase(1)}
          decrease={() => decrease(1)}
        />
        <FacilityList
          name="평행봉"
          count={평행봉}
          increase={() => increase(2)}
          decrease={() => decrease(2)}
        />
      </div>
      <Text
        typography="t7"
        className="mt-2 text-text-on-surface-muted dark:text-grey"
      >
        필요한 경우 건너뛰고 다음 단계로 이동할 수 있습니다.
      </Text>

      <GrowBox />

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
          type="button"
          className="flex size-8 items-center justify-center rounded-full text-text-on-surface transition-[transform,background-color,opacity] duration-150 active:scale-[0.97] active:bg-black/5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/35 disabled:cursor-not-allowed disabled:opacity-30 motion-reduce:transform-none motion-reduce:transition-none dark:text-grey-light dark:active:bg-white/10"
          onClick={() => decrease()}
          aria-label={`${name} 감소`}
          disabled={count <= 0}
        >
          <MinusIcon size={18} />
        </button>
        <Text className="flex w-10 items-center justify-center text-text-on-surface dark:text-grey-light">
          {count}
        </Text>
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-full text-text-on-surface transition-[transform,background-color,opacity] duration-150 active:scale-[0.97] active:bg-black/5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/35 disabled:cursor-not-allowed disabled:opacity-30 motion-reduce:transform-none motion-reduce:transition-none dark:text-grey-light dark:active:bg-white/10"
          onClick={() => increase()}
          aria-label={`${name} 증가`}
          disabled={count >= 99}
        >
          <PlusIcon size={18} />
        </button>
      </span>
    </div>
  );
};

export default SetFacilities;
