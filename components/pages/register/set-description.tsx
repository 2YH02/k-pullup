import Button from "@common/button";
import GrowBox from "@common/grow-box";
import Section from "@common/section";
import Text from "@common/text";
// TODO: textarea 공통 컴포넌트로 적용

interface SetDescriptionProps {
  next: (description?: string | null) => void;
  description: string | null;
  setDescription: (desc: string | null) => void;
}

const SetDescription = ({
  next,
  description,
  setDescription,
}: SetDescriptionProps) => {
  return (
    <Section className="flex h-full flex-col pb-0">
      <div className="my-4 rounded-xl border border-location-badge-bg/80 bg-location-badge-bg/45 px-3.5 py-3 dark:border-location-badge-bg-dark/70 dark:bg-location-badge-bg-dark/35">
        <Text
          fontWeight="bold"
          className="text-text-on-surface dark:text-grey-light"
        >
          정확한 설명을 등록해 주시면,
        </Text>
        <Text
          typography="t6"
          className="text-grey-dark dark:text-grey"
        >
          다른 사람이 해당 위치를 찾는 데 큰 도움이 됩니다!
        </Text>
      </div>

      <div>
        <textarea
          className="w-full resize-none rounded-xl border border-text-on-surface-muted/40 bg-location-badge-bg/58 p-3 text-black transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-text-on-surface-muted/85 focus:border-primary/70 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/20 dark:border-location-badge-bg-dark/90 dark:bg-location-badge-bg-dark/38 dark:text-white dark:placeholder:text-grey"
          maxLength={40}
          rows={4}
          placeholder="해당 위치에 대한 설명을 40자 이내로 작성해주세요."
          value={description ? description : ""}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        ></textarea>
        <Text
          typography="t7"
          className="mt-1.5 text-right text-text-on-surface-muted dark:text-grey"
        >
          {(description || "").length}/40
        </Text>
      </div>
      <GrowBox />

      {/* <BottomFixedButton
        onClick={() => {
          next(description === "" ? null : description);
        }}
        className="flex items-center justify-center h-12"
        containerStyle="px-0"
      >
        {description === "" ? "설명 없이 다음으로" : "다음"}
      </BottomFixedButton> */}

      <Button
        onClick={() => {
          next(description === "" ? null : description);
        }}
        className="h-12"
      >
        {description === "" ? "설명 없이 다음으로" : "다음"}
      </Button>
    </Section>
  );
};

export default SetDescription;
